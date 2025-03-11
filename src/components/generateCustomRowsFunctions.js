export function generateThreeSevenStructure() {
  const timestamp = Date.now();
  return {
    isSelected: true,
    bgColor: '#ffffff',
    padding: { top: 10, right: 40, bottom: 10, left: 40 },
    columns: [
      {
        content: [
          {
            blockId: `image-${timestamp}`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 33,
      },
      {
        content: [
          {
            blockId: `text-${timestamp}-1`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center;; margin: 0;"><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-2`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin: 0;"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `button-${timestamp}`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 67,
      },
    ],
  };
}

export function generateSevenThreeStructure() {
  const timestamp = Date.now();
  return {
    isSelected: true,
    bgColor: '#ffffff',
    padding: { top: 10, right: 40, bottom: 10, left: 40 },
    columns: [
      {
        content: [
          {
            blockId: `text-${timestamp}-1`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center;; margin: 0;"><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-2`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin: 0;"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `button-${timestamp}`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 67,
      },
      {
        content: [
          {
            blockId: `image-${timestamp}`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 33,
      },
    ],
  };
}

export function generateThreeSevenWithMarginStructure() {
  const timestamp = Date.now();
  return {
    isSelected: true,
    bgColor: '#1464A5',
    padding: { top: 20, right: 40, bottom: 20, left: 40 },
    columns: [
      {
        content: [
          {
            blockId: `image-${timestamp}`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#f0f0f0', right: '#f0f0f0', bottom: '#f0f0f0', left: '#f0f0f0' },
        },
        width: 33,
      },
      {
        content: [
          {
            blockId: `text-${timestamp}-1`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center;; margin: 0;"><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-2`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin: 0;"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `button-${timestamp}`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#f0f0f0', right: '#f0f0f0', bottom: '#f0f0f0', left: '#f0f0f0' },
        },
        width: 67,
      },
    ],
  };
}

export function generateSevenThreeWithMarginStructure() {
  const timestamp = Date.now();
  return {
    isSelected: true,
    bgColor: '#1464A5',
    padding: { top: 20, right: 40, bottom: 20, left: 40 },
    columns: [
      {
        content: [
          {
            blockId: `text-${timestamp}-1`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center;; margin: 0;"><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-2`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin: 0;"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `button-${timestamp}`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#f0f0f0', right: '#f0f0f0', bottom: '#f0f0f0', left: '#f0f0f0' },
        },
        width: 67,
      },
      {
        content: [
          {
            blockId: `image-${timestamp}`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#f0f0f0', right: '#f0f0f0', bottom: '#f0f0f0', left: '#f0f0f0' },
        },
        width: 33,
      },
    ],
  };
}

export function generateTwoColumnstructure() {
  const timestamp = Date.now();
  return {
    isSelected: true,
    bgColor: '#ffffff',
    padding: { top: 10, right: 40, bottom: 10, left: 40 },
    columns: [
      {
        content: [
          {
            blockId: `image-${timestamp}-1`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-2`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0; "><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `text-${timestamp}-3`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `button-${timestamp}-4`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 50,
      },
      {
        content: [
          {
            blockId: `image-${timestamp}-5`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-6`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0; "><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `text-${timestamp}-7`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `button-${timestamp}-8`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 50,
      },
    ],
  };
}

export function generateThreeColumnstructure() {
  const timestamp = Date.now();
  return {
    isSelected: true,
    bgColor: '#ffffff',
    padding: { top: 10, right: 40, bottom: 10, left: 40 },
    columns: [
      {
        content: [
          {
            blockId: `image-${timestamp}-1`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-2`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0; "><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `text-${timestamp}-3`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `button-${timestamp}-4`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 33,
      },
      {
        content: [
          {
            blockId: `image-${timestamp}-5`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-6`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0; "><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `text-${timestamp}-7`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `button-${timestamp}-8`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 33,
      },
      {
        content: [
          {
            blockId: `image-${timestamp}-9`,
            type: 'image',
            properties: {
              src: 'https://picsum.photos/200',
              alt: 'Imagen de ejemplo',
              href: '',
              width: 100,
              height: 'auto',
              alignment: 'center',
              containerPadding: { top: '10', right: '10', bottom: '10', left: '10' },
            },
          },
          {
            blockId: `text-${timestamp}-10`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0; "><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `text-${timestamp}-11`,
            type: 'text',
            properties: {
              text: '<p style="text-align:center; margin:0"><span style="color:#004481;font-size:14px;font-family:Arial;">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
              fontSize: '14px',
              lineHeight: 20,
              color: '#000000',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
          {
            blockId: `button-${timestamp}-12`,
            type: 'button',
            properties: {
              text: 'Botón',
              href: '',
              backgroundColor: '#1973b8',
              color: '#FFFFFF',
              padding: '12px 32px',
              borderRadius: '1px',
              alignment: 'center',
              containerPadding: {
                top: '10',
                right: '10',
                bottom: '10',
                left: '10',
              },
            },
          },
        ],
        backgroundColor: '#ffffff',
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
        },
        width: 33,
      },
    ],
  };
}
