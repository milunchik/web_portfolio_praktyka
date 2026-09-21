import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { UserRepository, UserEntity } from '../repositories/user.repository';
import { AppConfigService } from '../../../infrastructure/config/config.service';
import { GenerateCvQueryDto } from '../dtos/req/generate-cv-query.dto';

@Injectable()
export class GenerateUserCvPdfService {
  constructor(
    private readonly userRepository: UserRepository,
    @Optional() private readonly config?: AppConfigService,
  ) {}

  private formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'Present';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  private formatLevel(level: string): string {
    return level
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private async fetchImageBuffer(urlOrPath: string): Promise<Buffer | null> {
    try {
      if (!urlOrPath) return null;
      if (urlOrPath.startsWith('data:image/')) {
        const base64Data = urlOrPath.split(',')[1];
        if (base64Data) {
          return Buffer.from(base64Data, 'base64');
        }
      }
      if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
        const res = await fetch(urlOrPath, { signal: AbortSignal.timeout(4000) });
        if (!res.ok) return null;
        const arrayBuf = await res.arrayBuffer();
        return Buffer.from(arrayBuf);
      }
      if (fs.existsSync(urlOrPath)) {
        return fs.readFileSync(urlOrPath);
      }
      return null;
    } catch {
      return null;
    }
  }

  private renderAvatar(
    doc: PDFKit.PDFDocument,
    photoBuffer: Buffer | null,
    name: string,
    x: number,
    y: number,
    size: number,
  ): void {
    if (photoBuffer) {
      try {
        doc.save();
        doc.roundedRect(x, y, size, size, 10).clip();
        doc.image(photoBuffer, x, y, {
          width: size,
          height: size,
          fit: [size, size],
          align: 'center',
          valign: 'center',
        });
        doc.restore();
        doc
          .roundedRect(x, y, size, size, 10)
          .strokeColor('#E2E8F0')
          .lineWidth(1)
          .stroke();
        return;
      } catch {
        // Fallback to placeholder if image decode fails
      }
    }

    // Avatar Placeholder with Initial
    const initial = (name || 'U').trim().charAt(0).toUpperCase();
    doc.save();
    doc.roundedRect(x, y, size, size, 10).fillColor('#10B981').fill();
    doc
      .fillColor('#FFFFFF')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text(initial, x, y + 17, { width: size, align: 'center' });
    doc.restore();
  }

  async executeById(
    userId: number,
    options?: GenerateCvQueryDto,
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const buffer = await this.generatePdf(user, options);
    const fileName = `${user.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')}_CV.pdf`;
    return { buffer, fileName };
  }

  async executeByPublicUrl(
    publicUrl: string,
    options?: GenerateCvQueryDto,
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const user = await this.userRepository.findByPublicUrl(publicUrl);
    if (!user) {
      throw new NotFoundException(`User with public URL "${publicUrl}" not found`);
    }
    const buffer = await this.generatePdf(user, options);
    const fileName = `${user.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')}_CV.pdf`;
    return { buffer, fileName };
  }

  public async generatePdf(
    user: UserEntity,
    options?: GenerateCvQueryDto,
  ): Promise<Buffer> {
    const userCvOptions = (user.cvOptions as Record<string, boolean> | null) || {};

    const resolveOption = (
      queryVal: boolean | undefined,
      dbVal: boolean | undefined,
    ) => {
      if (queryVal !== undefined) return queryVal;
      if (dbVal !== undefined) return dbVal;
      return true;
    };

    const showPhoto = resolveOption(options?.showPhoto, userCvOptions.showPhoto);
    const showContact = resolveOption(options?.showContact, userCvOptions.showContact);
    const showAbout = resolveOption(options?.showAbout, userCvOptions.showAbout);
    const showExperience = resolveOption(options?.showExperience, userCvOptions.showExperience);
    const showEducation = resolveOption(options?.showEducation, userCvOptions.showEducation);
    const showSkills = resolveOption(options?.showSkills, userCvOptions.showSkills);
    const showLanguages = resolveOption(options?.showLanguages, userCvOptions.showLanguages);
    const showProjects = resolveOption(options?.showProjects, userCvOptions.showProjects);

    const avatarUrl =
      showPhoto
        ? user.avatarUrl ||
          user.fileName ||
          user.medias?.[0]?.url ||
          null
        : null;

    const photoBuffer = avatarUrl ? await this.fetchImageBuffer(avatarUrl) : null;

    const rawWebUrl =
      this.config?.corsOrigin ||
      process.env.WEB_URL ||
      process.env.APP_URL ||
      'http://localhost:3000';
    const webUrl = rawWebUrl.replace(/\/+$/, '');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `${user.fullName} - CV`,
          Author: user.fullName,
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#059669'; // Emerald 600
      const darkText = '#0F172A'; // Slate 900
      const bodyText = '#334155'; // Slate 700
      const mutedText = '#64748B'; // Slate 500
      const dividerColor = '#E2E8F0'; // Slate 200
      const sectionLineColor = '#D1FAE5'; // Emerald 100

      // ================= HEADER =================
      const photoSize = 58;
      const photoX = 595 - 40 - photoSize;
      const photoY = 40;

      if (showPhoto) {
        this.renderAvatar(doc, photoBuffer, user.fullName, photoX, photoY, photoSize);
      }

      const contentWidth = showPhoto ? photoX - 40 - 16 : 555 - 40;

      doc
        .fillColor(darkText)
        .fontSize(20)
        .font('Helvetica-Bold')
        .text(user.fullName, 40, 40, { width: contentWidth });

      doc.moveDown(0.2);
      doc
        .fillColor(primaryColor)
        .fontSize(10.5)
        .font('Helvetica-Bold')
        .text('Software Engineer / Full-stack Developer', 40, doc.y, { width: contentWidth });

      if (showContact) {
        const contactItems: string[] = [];
        if (user.location) contactItems.push(user.location);
        if (user.email) contactItems.push(user.email);
        if (user.website) contactItems.push(user.website.replace(/^https?:\/\//, ''));
        if (user.github) contactItems.push(`github.com/${user.github.replace(/^https?:\/\/github\.com\//, '')}`);
        if (user.linkedin) contactItems.push(`linkedin.com/in/${user.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`);
        if (user.publicUrl) contactItems.push(`${webUrl}/user/${user.publicUrl}`);

        if (contactItems.length > 0) {
          doc.moveDown(0.35);
          doc
            .fillColor(mutedText)
            .fontSize(8.5)
            .font('Helvetica')
            .text(contactItems.join('   •   '), 40, doc.y, { width: contentWidth });
        }
      }

      const aboutText = user.about || user.description;
      if (showAbout && aboutText) {
        doc.moveDown(0.45);
        doc
          .fillColor(bodyText)
          .fontSize(9)
          .font('Helvetica')
          .text(aboutText, 40, doc.y, { width: contentWidth, lineGap: 1.8 });
      }

      const headerBottom = showPhoto
        ? Math.max(doc.y + 8, photoY + photoSize + 10)
        : doc.y + 8;

      doc
        .strokeColor(dividerColor)
        .lineWidth(1)
        .moveTo(40, headerBottom)
        .lineTo(555, headerBottom)
        .stroke();

      doc.y = headerBottom + 12;

      const renderSectionHeading = (title: string) => {
        if (doc.y > 730) doc.addPage();
        doc.moveDown(0.3);
        const headingY = doc.y;
        doc
          .fillColor(primaryColor)
          .fontSize(9.5)
          .font('Helvetica-Bold')
          .text(title.toUpperCase(), 40, headingY);

        const lineY = doc.y + 2;
        doc
          .strokeColor(sectionLineColor)
          .lineWidth(1)
          .moveTo(40, lineY)
          .lineTo(555, lineY)
          .stroke();

        doc.y = lineY + 6;
      };

      // ================= WORK EXPERIENCE =================
      if (showExperience && user.experience && user.experience.length > 0) {
        renderSectionHeading('Work Experience');

        user.experience.forEach((exp: any) => {
          if (doc.y > 710) doc.addPage();

          // Position & Company
          doc
            .fillColor(darkText)
            .fontSize(10.5)
            .font('Helvetica-Bold')
            .text(`${exp.position} `, 40, doc.y, { continued: true })
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(`@ ${exp.company}`);

          // Dates
          const dateRange = `${this.formatDate(exp.startDate)} — ${this.formatDate(exp.endDate)}`;
          doc
            .fillColor(mutedText)
            .fontSize(8.5)
            .font('Helvetica')
            .text(dateRange);

          // Description
          if (exp.description) {
            doc.moveDown(0.2);
            doc
              .fillColor(bodyText)
              .fontSize(9)
              .font('Helvetica')
              .text(exp.description, { lineGap: 1.5 });
          }

          // Skills
          if (exp.skills && Array.isArray(exp.skills) && exp.skills.length > 0) {
            doc.moveDown(0.2);
            doc
              .fillColor(mutedText)
              .fontSize(8.5)
              .font('Helvetica-Bold')
              .text('Skills: ', { continued: true })
              .font('Helvetica')
              .fillColor(bodyText)
              .text(exp.skills.join(', '));
          }

          doc.moveDown(0.6);
        });
      }

      // ================= EDUCATION =================
      if (showEducation && user.education && user.education.length > 0) {
        renderSectionHeading('Education');

        user.education.forEach((edu: any) => {
          if (doc.y > 710) doc.addPage();

          const degreeText = edu.degree
            ? ` — ${this.formatLevel(edu.degree)} Degree`
            : '';

          doc
            .fillColor(darkText)
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(edu.title, 40, doc.y, { continued: Boolean(degreeText) });

          if (degreeText) {
            doc
              .fillColor('#475569')
              .font('Helvetica')
              .text(degreeText);
          }

          const dateRange = `${this.formatDate(edu.startDate)} — ${this.formatDate(edu.endDate)}`;
          doc
            .fillColor(mutedText)
            .fontSize(8.5)
            .font('Helvetica')
            .text(dateRange);

          doc.moveDown(0.5);
        });
      }

      // ================= PROJECTS =================
      if (showProjects && user.projects && user.projects.length > 0) {
        renderSectionHeading('Featured Projects');

        user.projects.forEach((project: any) => {
          if (doc.y > 710) doc.addPage();

          doc
            .fillColor(darkText)
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(project.title);

          if (project.description) {
            doc.moveDown(0.15);
            doc
              .fillColor(bodyText)
              .fontSize(9)
              .font('Helvetica')
              .text(project.description, { lineGap: 1.5 });
          }

          doc.moveDown(0.5);
        });
      }

      // ================= TECHNICAL SKILLS =================
      if (showSkills) {
        const uniqueSkills = Array.from(
          new Set(
            (user.experience || []).flatMap((exp: any) => exp.skills || []),
          ),
        ).filter(Boolean);

        if (uniqueSkills.length > 0) {
          renderSectionHeading('Technical Skills');
          doc
            .fillColor(bodyText)
            .fontSize(9)
            .font('Helvetica')
            .text(uniqueSkills.join('   •   '), { lineGap: 2 });
          doc.moveDown(0.5);
        }
      }

      // ================= LANGUAGES =================
      if (showLanguages && user.languages && user.languages.length > 0) {
        renderSectionHeading('Languages');

        const langs = user.languages
          .map((item: any) => {
            const langName = item.language?.name || item.name;
            const langLevel = item.language?.level || item.level;
            if (!langName) return null;
            return `${langName} (${this.formatLevel(langLevel || 'intermediate')})`;
          })
          .filter(Boolean);

        if (langs.length > 0) {
          doc
            .fillColor(bodyText)
            .fontSize(9)
            .font('Helvetica')
            .text(langs.join('   •   '), { lineGap: 2 });
          doc.moveDown(0.5);
        }
      }

      doc.end();
    });
  }
}
