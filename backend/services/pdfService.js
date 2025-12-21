const { jsPDF } = require('jspdf');

const generateApprovalPDF = async (applicationData, userData, schemeData) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('APPLICATION APPROVAL CERTIFICATE', 105, 30, { align: 'center' });
    
    // Application Info
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Applicant: ${userData.name}`, 20, 60);
    doc.text(`Email: ${userData.email}`, 20, 70);
    doc.text(`Application ID: ${applicationData._id}`, 20, 80);
    doc.text(`Applied Date: ${new Date(applicationData.applicationDate).toLocaleDateString()}`, 20, 90);
    doc.text(`Status: ${applicationData.status.toUpperCase()}`, 20, 100);
    
    // Personal Information
    doc.setFont(undefined, 'bold');
    doc.text('Personal Information', 20, 120);
    doc.setFont(undefined, 'normal');
    doc.text(`Father's Name: ${userData.fatherName || 'N/A'}`, 20, 135);
    doc.text(`Mother's Name: ${userData.motherName || 'N/A'}`, 20, 145);
    doc.text(`Mobile: ${userData.mobile || 'N/A'}`, 20, 155);
    doc.text(`Aadhaar: ${userData.aadhaar || 'N/A'}`, 20, 165);
    doc.text(`PAN: ${userData.pan || 'N/A'}`, 20, 175);
    doc.text(`Annual Income: ₹${userData.income || 'N/A'}`, 20, 185);
    doc.text(`IFSC Code: ${userData.ifsc || 'N/A'}`, 20, 195);
    doc.text(`Bank: ${userData.bank || 'N/A'}`, 20, 205);
    
    // Scheme Details
    doc.setFont(undefined, 'bold');
    doc.text('Scheme Details', 20, 225);
    doc.setFont(undefined, 'normal');
    doc.text(`Scheme: ${schemeData.title}`, 20, 240);
    doc.text(`Description: ${schemeData.description}`, 20, 250);
    
    // Footer
    doc.setFontSize(10);
    doc.text('This is a system generated document.', 105, 280, { align: 'center' });
    
    return doc.output('arraybuffer');
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

module.exports = { generateApprovalPDF };