import type { SlideElement, SlideContent, Brand } from '../types';

// Export a single slide to PNG
export async function exportToPNG(
  slide: SlideElement,
  brand: Brand,
  size: string,
  slideContent: SlideContent | undefined,
  returnBlob: boolean = false
): Promise<Blob | void> {
  // Parse size dimensions
  const [width, height] = size.split('x').map(Number);
  
  // Create SVG element
  const svg = createSlideSVG(slide, brand, slideContent, { width, height });
  
  // Convert SVG to PNG
  const pngBlob = await svgToPNG(svg, width, height);
  
  if (returnBlob) {
    return pngBlob;
  } else {
    // Download the file
    downloadBlob(pngBlob, generateFilename(brand, 'slide', size, 'png'));
  }
}

// Export multiple slides as ZIP
export async function exportToZIP(
  pngBlobs: Blob[],
  brand: Brand,
  templateId: string,
  size: string
): Promise<void> {
  try {
    // Import JSZip dynamically to avoid bundle size issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Add each PNG to the ZIP with proper naming
    pngBlobs.forEach((blob, index) => {
      const filename = generateFilename(brand, templateId, size, 'png', index + 1);
      zip.file(filename, blob);
    });
    
    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, generateFilename(brand, templateId, size, 'zip'));
  } catch (error) {
    console.error('ZIP export failed:', error);
    throw new Error('Failed to create ZIP file');
  }
}

// Export multiple slides as PDF
export async function exportToPDF(
  slideImages: Blob[],
  brand: Brand,
  templateId: string,
  size: string
): Promise<void> {
  try {
    // Import jsPDF dynamically
    const { jsPDF } = await import('jspdf');
    
    // Parse size dimensions
    const [width, height] = size.split('x').map(Number);
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height]
    });
    
    // Add each slide as a page
    for (let i = 0; i < slideImages.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      // Convert blob to base64
      const base64 = await blobToBase64(slideImages[i]);
      
      // Add image to page
      pdf.addImage(base64, 'PNG', 0, 0, width, height);
    }
    
    // Download PDF
    const filename = generateFilename(brand, templateId, size, 'pdf');
    pdf.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to create PDF file');
  }
}

// Create SVG for a slide
function createSlideSVG(
  slide: SlideElement,
  brand: Brand,
  slideContent: SlideContent | undefined,
  dimensions: { width: number; height: number }
): SVGElement {
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', dimensions.width.toString());
  svg.setAttribute('height', dimensions.height.toString());
  svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // Add background
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', dimensions.width.toString());
  bgRect.setAttribute('height', dimensions.height.toString());
  bgRect.setAttribute('fill', getTokenColor(brand, 'bg'));
  svg.appendChild(bgRect);
  
  // Don't render if element is hidden
  if (slide.visible === false) {
    return svg;
  }
  
  // Convert percentage positions to absolute pixels
  const x = (slide.rect.x / 100) * dimensions.width;
  const y = (slide.rect.y / 100) * dimensions.height;
  const width = (slide.rect.w / 100) * dimensions.width;
  const height = (slide.rect.h / 100) * dimensions.height;
  
  // Snap to pixel boundaries
  const snapToPixel = (value: number) => Math.round(value);
  
  // Render based on slide type
  switch (slide.type) {
    case 'headline':
    case 'subheadline':
    case 'body':
    case 'footer':
      svg.appendChild(createTextElement(slide, brand, slideContent, { x, y, width, height }, snapToPixel));
      break;
    case 'bullets':
      svg.appendChild(createBulletsElement(slide, brand, slideContent, { x, y, width, height }, snapToPixel));
      break;
    case 'cta':
      svg.appendChild(createCTAElement(slide, brand, slideContent, { x, y, width, height }, snapToPixel));
      break;
    case 'shape':
    case 'progress':
      svg.appendChild(createShapeElement(slide, brand, { x, y, width, height }, snapToPixel));
      break;
  }
  
  return svg;
}

// Create text element
function createTextElement(
  slide: SlideElement,
  brand: Brand,
  slideContent: SlideContent | undefined,
  rect: { x: number; y: number; width: number; height: number },
  snapToPixel: (value: number) => number
): SVGElement {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  const content = getContentForElement(slide.type, slideContent);
  
  text.setAttribute('x', snapToPixel(rect.x + rect.width / 2).toString());
  text.setAttribute('y', snapToPixel(rect.y + rect.height / 2).toString());
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'middle');
  text.setAttribute('fill', getTokenColor(brand, slide.style.tokenBinding));
  text.setAttribute('font-size', (slide.textDefaults?.fontSize || 24).toString());
  text.setAttribute('font-weight', (slide.textDefaults?.fontWeight || 400).toString());
  text.setAttribute('font-family', brand.fontFamily || 'Inter');
  
  if (slide.textDefaults?.fontStyle) {
    text.setAttribute('font-style', slide.textDefaults.fontStyle);
  }
  
  text.textContent = content;
  return text;
}

// Create bullets element
function createBulletsElement(
  slide: SlideElement,
  brand: Brand,
  slideContent: SlideContent | undefined,
  rect: { x: number; y: number; width: number; height: number },
  snapToPixel: (value: number) => number
): SVGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const content = getContentForElement(slide.type, slideContent);
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', snapToPixel(rect.x + slide.style.padding).toString());
    text.setAttribute('y', snapToPixel(rect.y + slide.style.padding + (index + 1) * 20).toString());
    text.setAttribute('fill', getTokenColor(brand, slide.style.tokenBinding));
    text.setAttribute('font-size', (slide.textDefaults?.fontSize || 16).toString());
    text.setAttribute('font-weight', (slide.textDefaults?.fontWeight || 400).toString());
    text.setAttribute('font-family', brand.fontFamily || 'Inter');
    text.setAttribute('dominant-baseline', 'hanging');
    text.textContent = line;
    group.appendChild(text);
  });
  
  return group;
}

// Create CTA element
function createCTAElement(
  slide: SlideElement,
  brand: Brand,
  slideContent: SlideContent | undefined,
  rect: { x: number; y: number; width: number; height: number },
  snapToPixel: (value: number) => number
): SVGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const content = getContentForElement(slide.type, slideContent);
  
  // Background rectangle
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('x', snapToPixel(rect.x).toString());
  bgRect.setAttribute('y', snapToPixel(rect.y).toString());
  bgRect.setAttribute('width', snapToPixel(rect.width).toString());
  bgRect.setAttribute('height', snapToPixel(rect.height).toString());
  bgRect.setAttribute('fill', getTokenColor(brand, slide.style.tokenBinding));
  bgRect.setAttribute('rx', slide.style.radius.toString());
  bgRect.setAttribute('ry', slide.style.radius.toString());
  group.appendChild(bgRect);
  
  // Text
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', snapToPixel(rect.x + rect.width / 2).toString());
  text.setAttribute('y', snapToPixel(rect.y + rect.height / 2).toString());
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'middle');
  text.setAttribute('fill', '#FFFFFF');
  text.setAttribute('font-size', (slide.textDefaults?.fontSize || 18).toString());
  text.setAttribute('font-weight', (slide.textDefaults?.fontWeight || 600).toString());
  text.setAttribute('font-family', brand.fontFamily || 'Inter');
  text.textContent = content;
  group.appendChild(text);
  
  return group;
}

// Create shape element
function createShapeElement(
  slide: SlideElement,
  brand: Brand,
  rect: { x: number; y: number; width: number; height: number },
  snapToPixel: (value: number) => number
): SVGElement {
  const shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  shape.setAttribute('x', snapToPixel(rect.x).toString());
  shape.setAttribute('y', snapToPixel(rect.y).toString());
  shape.setAttribute('width', snapToPixel(rect.width).toString());
  shape.setAttribute('height', snapToPixel(rect.height).toString());
  shape.setAttribute('fill', getTokenColor(brand, slide.style.tokenBinding));
  shape.setAttribute('rx', slide.style.radius.toString());
  shape.setAttribute('ry', slide.style.radius.toString());
  return shape;
}

// Get content for element type
function getContentForElement(elementType: string, slideContent: SlideContent | undefined): string {
  if (!slideContent) return '';
  
  switch (elementType) {
    case 'headline': return slideContent.headline || 'Your Headline Here';
    case 'subheadline': return slideContent.subheadline || 'Supporting text goes here';
    case 'body': return slideContent.body || 'Body content for your ad';
    case 'bullets': return slideContent.bullets || '• Point 1\n• Point 2\n• Point 3';
    case 'cta': return slideContent.cta || 'Call to Action';
    case 'footer': return slideContent.footer || 'Additional information';
    default: return '';
  }
}

// Get token color
function getTokenColor(brand: Brand, token: string): string {
  return brand.colorMapping[token as keyof typeof brand.colorMapping] || '#000000';
}

// Convert SVG to PNG
async function svgToPNG(svg: SVGElement, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Create image
      const img = new Image();
      img.onload = () => {
        try {
          // Draw image to canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
            URL.revokeObjectURL(url);
          }, 'image/png');
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };
      
      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

// Convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Generate filename
function generateFilename(brand: Brand, templateId: string, size: string, extension: string, slideNumber?: number): string {
  const brandName = brand.fontFamily || 'brand';
  const slideSuffix = slideNumber ? `-s${slideNumber.toString().padStart(2, '0')}` : '';
  return `${brandName}-${templateId}-${size}${slideSuffix}.${extension}`;
}

// Download blob
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
