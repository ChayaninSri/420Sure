
import React, { useEffect } from 'react';
import './fonts.css';

interface PDFReportProps {
  reportData: {
    id: string;
    facilityName: string;
    license: string;
    inspector: string;
    inspectionDate: string;
    totalScore: number;
    categories: Array<{
      name: string;
      score: number;
      maxScore: number;
      items?: Array<{
        id: string;
        text: string;
        score: number;
        maxScore: number;
        notes?: string;
      }>;
    }>;
    location: string;
    notes: string;
    signature?: string;
  };
}

const PDFReport: React.FC<PDFReportProps> = ({ reportData }) => {
  console.log('PDFReport received reportData:', reportData);

  // Helper function to get item score and notes
  const getItemData = (categoryIndex: number, itemId: string) => {
    const category = reportData.categories[categoryIndex];
    if (!category?.items) return { score: 0, maxScore: 2, notes: '' };
    
    const item = category.items.find(item => item.id === itemId);
    return item ? { 
      score: item.score, 
      maxScore: item.maxScore, 
      notes: item.notes || '' 
    } : { score: 0, maxScore: 2, notes: '' };
  };

  // Helper function to get check mark based on score
  const getCheckMark = (score: number, maxScore: number, level: 'good' | 'fair' | 'poor') => {
    const percentage = (score / maxScore) * 100;
    
    switch (level) {
      case 'good':
        return percentage >= 90 ? '✓' : '';
      case 'fair':
        return percentage >= 70 && percentage < 90 ? '✓' : '';
      case 'poor':
        return percentage < 70 ? '✓' : '';
      default:
        return '';
    }
  };

  const pageStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    padding: '0',
    margin: '0 0 0 0',
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
    display: 'block',
    boxSizing: 'border-box',
    pageBreakInside: 'auto',
  };

  const backgroundImageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    zIndex: 0,
  };

  const overlayContentStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  };

  const textOverlayStyle: React.CSSProperties = {
    fontSize: '16px', 
    fontFamily: 'Sarabun, Arial, sans-serif',
    lineHeight: '1.2',
    letterSpacing: '0.3px',
    wordSpacing: '0.3px',
    color: 'black',
  };

  // Check if reportData exists
  if (!reportData || !reportData.categories) {
    return <div>Loading report data or data is invalid...</div>;
  }

  return (
    <div style={{ 
      display: 'block', 
      width: '210mm',
      minHeight: '297mm',
      backgroundColor: 'white',
      fontFamily: 'Sarabun, Arial, sans-serif'
    }}>
      {/* Page 1 */}
      <div style={pageStyle}>
        <img 
          src="/lovable-uploads/TS2 p1.jpg" 
          alt="Form Background Page 1"
          style={backgroundImageStyle}
        />
        
        <div style={{ ...overlayContentStyle, ...textOverlayStyle }}>
          {/* Basic facility information */}
          <div style={{ position: 'absolute', top: '95px', left: '220px', fontSize: '16px', fontWeight: 'bold' }}>
            {reportData.facilityName}
          </div>
          
          <div style={{ position: 'absolute', top: '95px', right: '70px', fontSize: '16px' }}>
            {reportData.license}
          </div>
          
          <div style={{ position: 'absolute', top: '115px', left: '170px', fontSize: '16px' }}>
            {reportData.inspectionDate}
          </div>
          
          {/* Score table with check marks for each item */}
          <div style={{ position: 'absolute', top: '550px', left: '50px', right: '50px' }}>
            {/* Item 1.1 */}
            <div style={{ position: 'absolute', top: '0px' }}>
              {(() => {
                const itemData = getItemData(0, "1.1");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Item 1.2 */}
            <div style={{ position: 'absolute', top: '50px' }}>
              {(() => {
                const itemData = getItemData(0, "1.2");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Item 1.3 */}
            <div style={{ position: 'absolute', top: '100px' }}>
              {(() => {
                const itemData = getItemData(0, "1.3");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
          
            {/* Item 1.4.1 */}
            <div style={{ position: 'absolute', top: '200px' }}>
              {(() => {
                const itemData = getItemData(0, "1.4.1");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Item 1.4.2 */}
            <div style={{ position: 'absolute', top: '250px' }}>
              {(() => {
                const itemData = getItemData(0, "1.4.2");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Item 1.4.3 */}
            <div style={{ position: 'absolute', top: '310px' }}>
              {(() => {
                const itemData = getItemData(0, "1.4.3");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Item 1.5 */}
            <div style={{ position: 'absolute', top: '365px' }}>
              {(() => {
                const itemData = getItemData(0, "1.5");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Item 1.6 */}
            <div style={{ position: 'absolute', top: '425px' }}>
              {(() => {
                const itemData = getItemData(0, "1.6");
                return (
                  <>
                    <div style={{ position: 'absolute', left: '360px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'good')}
                    </div>
                    <div style={{ position: 'absolute', left: '400px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'fair')}
                    </div>
                    <div style={{ position: 'absolute', left: '435px', textAlign: 'center', width: '25px', fontSize: '18px' }}>
                      {getCheckMark(itemData.score, itemData.maxScore, 'poor')}
                    </div>
                    <div style={{ 
                      position: 'absolute', 
                      left: '575px', 
                      width: '300px', 
                      fontSize: '14px',
                      wordWrap: 'break-word', 
                      whiteSpace: 'pre-wrap',
                      maxWidth: '300px',
                      lineHeight: '1.2'
                    }}>
                      {itemData.notes}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          
          {/* Inspector signature area */}
          <div style={{ position: 'absolute', bottom: '100px', left: '400px' }}>
            {reportData.signature && (
              <img 
                src={reportData.signature} 
                alt="Signature" 
                style={{ maxWidth: '150px', maxHeight: '70px', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Page 2 */}
      <div style={pageStyle}>
        <img 
          src="/lovable-uploads/TS2 p2.jpg" 
          alt="Form Background Page 2"
          style={backgroundImageStyle}
        />
        <div style={overlayContentStyle}>
          <div style={{ ...textOverlayStyle, position: 'absolute', top: '100px', left: '100px' }}>
            {/* Sample data for page 2 - can be customized based on actual form requirements */}
            <div style={{ fontSize: '14px', color: '#333' }}>
              หน้า 2: รายละเอียดการตรวจเพิ่มเติม
            </div>
          </div>
        </div>
      </div>

      {/* Page 3 */}
      <div style={pageStyle}>
        <img 
          src="/lovable-uploads/TS2 p3.jpg" 
          alt="Form Background Page 3"
          style={backgroundImageStyle}
        />
        <div style={overlayContentStyle}>
          <div style={{ ...textOverlayStyle, position: 'absolute', top: '100px', left: '100px' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>
              หน้า 3: รายละเอียดการตรวจเพิ่มเติม
            </div>
          </div>
        </div>
      </div>

      {/* Page 4 */}
      <div style={pageStyle}>
        <img 
          src="/lovable-uploads/TS2 p4.jpg" 
          alt="Form Background Page 4"
          style={backgroundImageStyle}
        />
        <div style={overlayContentStyle}>
          <div style={{ ...textOverlayStyle, position: 'absolute', top: '100px', left: '100px' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>
              หน้า 4: รายละเอียดการตรวจเพิ่มเติม
            </div>
          </div>
        </div>
      </div>

      {/* Page 5 */}
      <div style={pageStyle}>
        <img 
          src="/lovable-uploads/TS2 p5.jpg" 
          alt="Form Background Page 5"
          style={backgroundImageStyle}
        />
        <div style={overlayContentStyle}>
          <div style={{ ...textOverlayStyle, position: 'absolute', top: '100px', left: '100px' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>
              หน้า 5: รายละเอียดการตรวจเพิ่มเติม
            </div>
          </div>
        </div>
      </div>

      {/* Page 6 */}
      <div style={pageStyle}>
        <img 
          src="/lovable-uploads/TS2 p6.jpg" 
          alt="Form Background Page 6"
          style={backgroundImageStyle}
        />
        <div style={overlayContentStyle}>
          <div style={{ ...textOverlayStyle, position: 'absolute', top: '100px', left: '100px' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>
              หน้า 6: รายละเอียดการตรวจเพิ่มเติม
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReport;
