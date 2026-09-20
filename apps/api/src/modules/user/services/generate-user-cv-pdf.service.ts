import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { UserRepository, UserEntity } from '../repositories/user.repository';

@Injectable()
export class GenerateUserCvPdfService {
  constructor(private readonly userRepository: UserRepository) {}

  private formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'Present';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  private formatLevel(level: string): string {
    return level.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  async executeById(userId: number): Promise<{ buffer: Buffer; fileName: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const buffer = await this.generatePdf(user);
    const fileName = `${user.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')}_CV.pdf`;
    return { buffer, fileName };
  }

  async executeByPublicUrl(publicUrl: string): Promise<{ buffer: Buffer; fileName: string }> {
    const user = await this.userRepository.findByPublicUrl(publicUrl);
    if (!user) {
      throw new NotFoundException(`User with public URL "${publicUrl}" not found`);
    }
    const buffer = await this.generatePdf(user);
    const fileName = `${user.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')}_CV.pdf`;
    return { buffer, fileName };
  }

  public generatePdf(user: UserEntity): Promise<Buffer> {
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

      const primaryColor = '#1E3A8A'; // Deep Slate Navy
      const darkText = '#1F2937'; // Slate 800
      const mutedText = '#6B7280'; // Slate 500
      const accentBg = '#F3F4F6'; // Light gray
      const dividerColor = '#E5E7EB';

      // ================= HEADER =================
      doc
        .fillColor(primaryColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text(user.fullName, { align: 'left' });

      doc.moveDown(0.2);

      const contactItems: string[] = [];
      if (user.email) contactItems.push(user.email);
      if (user.publicUrl) contactItems.push(`portfolio.me/${user.publicUrl}`);

      doc
        .fillColor(mutedText)
        .fontSize(10)
        .font('Helvetica')
        .text(contactItems.join('   |   '), { align: 'left' });

      if (user.description) {
        doc.moveDown(0.5);
        doc
          .fillColor(darkText)
          .fontSize(10)
          .font('Helvetica')
          .text(user.description, { align: 'left', lineGap: 2 });
      }

      doc.moveDown(0.8);
      doc
        .strokeColor(dividerColor)
        .lineWidth(1)
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();

      doc.moveDown(0.8);

      const renderSectionHeading = (title: string) => {
        if (doc.y > 720) doc.addPage();
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(title.toUpperCase());
        doc.moveDown(0.1);
        doc
          .strokeColor(primaryColor)
          .lineWidth(1.5)
          .moveTo(40, doc.y)
          .lineTo(120, doc.y)
          .stroke();
        doc.moveDown(0.5);
      };

      // ================= WORK EXPERIENCE =================
      if (user.experience && user.experience.length > 0) {
        renderSectionHeading('Experience');

        user.experience.forEach((exp: any) => {
          if (doc.y > 700) doc.addPage();

          // Position & Company
          doc
            .fillColor(darkText)
            .fontSize(11)
            .font('Helvetica-Bold')
            .text(`${exp.position} `, { continued: true })
            .fillColor(primaryColor)
            .font('Helvetica')
            .text(`@ ${exp.company}`);

          // Dates
          const dateRange = `${this.formatDate(exp.startDate)} – ${this.formatDate(exp.endDate)}`;
          doc
            .fillColor(mutedText)
            .fontSize(9)
            .font('Helvetica')
            .text(dateRange);

          doc.moveDown(0.2);

          // Description
          if (exp.description) {
            doc
              .fillColor(darkText)
              .fontSize(9.5)
              .font('Helvetica')
              .text(exp.description, { lineGap: 1.5 });
          }

          // Skills
          if (exp.skills && Array.isArray(exp.skills) && exp.skills.length > 0) {
            doc.moveDown(0.2);
            doc
              .fillColor(mutedText)
              .fontSize(9)
              .font('Helvetica-Bold')
              .text('Skills: ', { continued: true })
              .font('Helvetica')
              .text(exp.skills.join(', '));
          }

          doc.moveDown(0.7);
        });

        doc.moveDown(0.3);
      }

      // ================= EDUCATION =================
      if (user.education && user.education.length > 0) {
        renderSectionHeading('Education');

        user.education.forEach((edu: any) => {
          if (doc.y > 700) doc.addPage();

          const degreeText = edu.degree
            ? `${this.formatLevel(edu.degree)}'s Degree in `
            : '';

          doc
            .fillColor(darkText)
            .fontSize(11)
            .font('Helvetica-Bold')
            .text(`${degreeText}${edu.title}`);

          const dateRange = `${this.formatDate(edu.startDate)} – ${this.formatDate(edu.endDate)}`;
          doc
            .fillColor(mutedText)
            .fontSize(9)
            .font('Helvetica')
            .text(dateRange);

          doc.moveDown(0.6);
        });

        doc.moveDown(0.3);
      }

      // ================= PROJECTS =================
      if (user.projects && user.projects.length > 0) {
        renderSectionHeading('Projects');

        user.projects.forEach((project: any) => {
          if (doc.y > 700) doc.addPage();

          doc
            .fillColor(darkText)
            .fontSize(11)
            .font('Helvetica-Bold')
            .text(project.title);

          if (project.description) {
            doc.moveDown(0.1);
            doc
              .fillColor(darkText)
              .fontSize(9.5)
              .font('Helvetica')
              .text(project.description, { lineGap: 1.5 });
          }

          doc.moveDown(0.6);
        });

        doc.moveDown(0.3);
      }

      // ================= LANGUAGES =================
      if (user.languages && user.languages.length > 0) {
        renderSectionHeading('Languages');

        user.languages.forEach((item: any) => {
          if (doc.y > 720) doc.addPage();

          const lang = item.language || item;
          const name = lang.name || 'Language';
          const level = lang.level ? this.formatLevel(lang.level) : '';

          doc
            .fillColor(darkText)
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(`• ${name}`, { continued: Boolean(level) });

          if (level) {
            doc
              .fillColor(mutedText)
              .font('Helvetica')
              .text(` — ${level}`);
          }
        });

        doc.moveDown(0.6);
      }

      // Finalize document
      doc.end();
    });
  }
}
