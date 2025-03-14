import { jsPDF } from 'jspdf';
// import View from './View.js';

class PDFView {
  async generatePDF(opportunity) {
    const doc = new jsPDF();

    // Deutsche Telekom color
    const pinkColor = [226, 0, 116];

    // --- Header Section ---
    // Pink rectangle
    doc.setFillColor(...pinkColor);
    doc.rect(20, 15, 173, 70, 'F');

    // Dotted pattern
    doc.setDrawColor(0);
    for (let i = 63; i < 159; i += 12) {
      doc.circle(i, 7.5, 1.5, 'F');
    }

    // Circular shape (top right)
    const circleShape = await this.loadImage('img/circleShapePDF.jpg');
    doc.addImage(circleShape, 'JPEG', 166.7, 0, 45, 38);

    // Header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('Deutsche Telekom Opportunity', 25, 25);
    doc.text(`${opportunity.title}`, 25, 33);

    // Opportunity Information in Header
    const experienceList = Array.isArray(opportunity.experience)
      ? opportunity.experience
      : [opportunity.experience];

    const tagsList = Array.isArray(opportunity.tags)
      ? opportunity.tags
      : [opportunity.tags];

    const today = new Date();
    const formattedToday = today.toLocaleDateString();

    doc.setFontSize(14);
    const headerInfo = [
      `Type: ${opportunity.type}`,
      `Location: ${opportunity.location}`,
      `Experience: ${experienceList.join(', ')}`,
      `Engagement: ${opportunity.engagementType}`,
      `Deadline: ${opportunity.deadline} from ${formattedToday}`,
      `Tags: ${tagsList.join(', ')}`,
    ];

    // Add header info with spacing
    let yOffset = 41;
    headerInfo.forEach((line) => {
      doc.text(line, 25, yOffset);
      yOffset += 8; // Adjust the spacing between lines
    });

    // doc.text(headerInfo.join('\n'), 25, 41);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('Details:', 20, 100);
    // --- Opportunity Details Section ---
    // const yourProfileList = Array.isArray(opportunity.yourProfile)
    //   ? opportunity.yourProfile
    //   : [opportunity.yourProfile];

    // doc.setFontSize(14);
    // const details = [
    //   `Description: ${opportunity.opportunityDescription}`,
    //   `Profile: ${yourProfileList.join(', ')}`,
    //   `Benefits: ${opportunity.benefits.join(', ')}`,
    //   `Employee Info: ${opportunity.employeeInfo}`,
    // ];
    // doc.text(details.join('\n \n'), 20, 110);

    doc.setFontSize(14);
    const wrapText = (text, x, y, maxWidth) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        doc.text(line, x, y);
        y += 6; // Adjust line height
      });
      return y;
    };

    let yPosition = 110;
    yPosition = wrapText(
      `Description \n${opportunity.opportunityDescription}`,
      20,
      yPosition,
      173
    );
    yPosition += 6;

    // Profile Section with Bullet Points
    const profileList = Array.isArray(opportunity.yourProfile)
      ? opportunity.yourProfile
      : [opportunity.yourProfile];
    doc.text('Qualifications & Requirements', 20, yPosition);
    yPosition += 6;
    profileList.forEach((item) => {
      doc.text(`• ${item}`, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 6;

    // Benefits Section with Bullet Points
    const benefitsList = Array.isArray(opportunity.benefits)
      ? opportunity.benefits
      : [opportunity.benefits];
    doc.text('Benefits', 20, yPosition);
    yPosition += 6;
    benefitsList.forEach((item) => {
      doc.text(`• ${item}`, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 6;

    // Employee Info
    yPosition = wrapText(
      `Employee Info \n${opportunity.employeeInfo}`,
      20,
      yPosition,
      173
    );

    // --- Footer Section ---
    const logo = await this.loadImage('img/logo2PDF.jpg');
    doc.addImage(logo, 'JPEG', 20, 240, 30, 35);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    // Footer Text
    const footerText = [
      'Deutsche Telekom AG',
      `Contact: ${opportunity.contactPerson}`,
      `${opportunity.contactPersonEmail}`,
    ];

    // Position the text next to the logo
    let footerY = 250;
    footerText.forEach((line) => {
      doc.text(line, 125, footerY, { maxWidth: 68 });
      footerY += 6;
    });

    // Save the PDF
    doc.save(`${opportunity.title.replace(/ /g, '_')}.pdf`);
  }

  async loadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });
  }
}

export default new PDFView();
