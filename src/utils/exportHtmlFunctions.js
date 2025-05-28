export function getColumnWidthInPixels(rows, rowIndex, columnIndex) {
  const row = rows[rowIndex];
  const column = row.columns[columnIndex];
  const containerWidth = 600;

  const columnWidth =
    ((typeof column.width === 'number' ? column.width : parseFloat(column.width.replace('%', ''))) / 100) *
    containerWidth;

  const totalPadding = column.padding.left + column.padding.right;
  return columnWidth - totalPadding;
}

export function generateMJML(rows) {
  let mjmlContent = `
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-image fluid-on-mobile="true" />
        </mj-attributes>
        <mj-style>
          a { color: rgb(25, 115, 184); text-decoration: none; font-weight: bold; }
        </mj-style>
      </mj-head>
      <mj-body>
        <mj-wrapper>
  `;

  rows.forEach((row, rowIndex) => {
    mjmlContent += `
      <mj-section
        width="600px"
        background-color="${row.bgColor || '#ffffff'}"
        padding="${row.padding.top}px ${row.padding.right}px ${row.padding.bottom}px ${row.padding.left}px"
      >
    `;

    const onlyOneColumn = row.columns.length === 1;
    const isButtonRow = row.columns.every((col) => col.content.length === 1 && col.content[0].type === 'button');

    row.columns.forEach((column, columnIndex) => {
      const cssClass = isButtonRow || onlyOneColumn ? 'not-table-cell' : '';

      mjmlContent += `
        <mj-column
          ${cssClass ? `css-class="${cssClass}"` : ''}
          width="${column.width}%"
          background-color="${column.backgroundColor || '#ffffff'}"
          padding="${column.padding.top}px ${column.padding.right}px ${column.padding.bottom}px ${column.padding.left}px"
          border-top="${column.border.width.top}px solid ${column.border.color.top}"
          border-right="${column.border.width.right}px solid ${column.border.color.right}"
          border-bottom="${column.border.width.bottom}px solid ${column.border.color.bottom}"
          border-left="${column.border.width.left}px solid ${column.border.color.left}"
        >
      `;

      column.content.forEach((block) => {
        if (block.type === 'button') {
          const hrefAttribute = block.properties.href ? `href="${block.properties.href}"` : '';
          mjmlContent += `
            <mj-button
              ${hrefAttribute}
              font-family="Arial, sans-serif"
              background-color="${block.properties.backgroundColor || '#1973b8'}"
              color="${block.properties.color || '#ffffff'}"
              padding="${block.properties.padding || '12px 32px'}"
              border-radius="${block.properties.borderRadius || '1px'}"
              align="${block.properties.alignment || 'center'}"
            >
              ${block.properties.text}
            </mj-button>
          `;
        } else if (block.type === 'text') {
          mjmlContent += `
            <mj-text
              font-size="${block.properties.fontSize || '14px'}"
              line-height="${block.properties.lineHeight}px"
              color="${block.properties.color || '#000000'}"
              padding="${block.properties.containerPadding.top}px ${block.properties.containerPadding.right}px ${block.properties.containerPadding.bottom}px ${block.properties.containerPadding.left}px"
              align="${block.properties.alignment || 'left'}"
            >
              ${block.properties.text}
            </mj-text>
          `;
        } else if (block.type === 'image') {
          const columnWidth = getColumnWidthInPixels(rows, rowIndex, columnIndex);
          const imagePadding =
            Number(block.properties.containerPadding.left) + Number(block.properties.containerPadding.right);
          const imageWidthPx = Math.max(0, Math.round((block.properties.width / 100) * (columnWidth - imagePadding)));
          const hrefAttribute = block.properties.href ? `href="${block.properties.href}"` : '';
          mjmlContent += `
            <mj-image
              ${hrefAttribute}
              src="${block.properties.src}"
              alt="${block.properties.alt || ''}"
              align="${block.properties.alignment}"
              padding="${block.properties.containerPadding.top}px ${block.properties.containerPadding.right}px ${block.properties.containerPadding.bottom}px ${block.properties.containerPadding.left}px"
            />
          `;
        }
      });

      mjmlContent += `</mj-column>`;
    });

    mjmlContent += `</mj-section>`;
  });

  mjmlContent += `
        </mj-wrapper>
      </mj-body>
    </mjml>
  `;

  return mjmlContent;
}

export function postProcessHTML(html, minWidthMap = {}) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Ensure all <td> elements behave as table-cells and stretch full height
  const columns = doc.querySelectorAll('td');
  columns.forEach((column) => {
    column.style.height = '100%';
    column.style.display = 'table-cell';
  });

  // Select all mjml columns except those with the .not-table-cell class
  const mjColumns = doc.querySelectorAll('[class^="mj-column-per"]:not(.not-table-cell)');

  mjColumns.forEach((column) => {
    // Add class to enable responsive display on desktop
    column.classList.add('desktop-table-cell');

    // Extract background-color from the first <td> and apply to column
    const firstTd = column.querySelector('td');
    if (firstTd) {
      const tdStyle = firstTd.getAttribute('style');
      if (tdStyle) {
        const bgColorMatch = tdStyle.match(/background-color:\s*([^;]+)/);
        if (bgColorMatch) {
          const bgColor = bgColorMatch[1];
          column.style.backgroundColor = bgColor;
        }
      }
    }

    // Extract the percentage value from the mj-column-per-XX class
    const className = Array.from(column.classList).find((cls) => cls.startsWith('mj-column-per-'));
    if (className) {
      const percentage = className.split('-').pop();
      const existingStyle = column.getAttribute('style') || '';
      const newStyles = `width: ${percentage}%; max-width: ${percentage}%;`;
      column.setAttribute('style', `${existingStyle} ${newStyles}`);
    }
  });

  // Inject responsive styles
  const styleContent = `
    @media only screen and (min-width: 400px) {
      .desktop-table-cell {
        display: table-cell !important;
      }
      .mj-column-per-50 {
        min-width: ${minWidthMap[50]};
      }
      .mj-column-per-67 {
        min-width: ${minWidthMap[67]};
      }
      .mj-column-per-33 {
        min-width: ${minWidthMap[33]};
      }
      .mj-column-per-33-333333333333336 {
        min-width: ${minWidthMap[33]};
      }
    }
    @media only screen and (max-width: 399px) {
      .desktop-table-cell {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
      }
    }
  `;

  const styleElement = doc.createElement('style');
  styleElement.textContent = styleContent;

  const head = doc.querySelector('head') || doc.createElement('head');
  head.appendChild(styleElement);

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
}
