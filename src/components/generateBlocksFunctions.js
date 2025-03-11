export function generateImgBlock() {
  const timestamp = Date.now();
  return {
    blockId: `image-${timestamp}`,
    type: 'image',
    properties: {
      src: 'https://picsum.photos/200',
      alt: 'Default img',
      href: '',
      width: 100,
      height: 'auto',
      alignment: 'center',
      containerPadding: {
        top: '10',
        right: '10',
        bottom: '10',
        left: '10',
      },
    },
  };
}

export function generateTextBlock() {
  const timestamp = Date.now();
  return {
    blockId: `text-${timestamp}`,
    type: 'text',
    properties: {
      text: '<p style=\"text-align:center; margin: 0;\"><span style=\"color:#004481;font-size:15px;font-family:Arial;\">Este texto es de ejemplo. Haciendo clic en el icono del lápiz puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
      fontSize: '15px',
      lineHeight: 24,
      color: '#000000',
      containerPadding: {
        top: '10',
        right: '20',
        bottom: '10',
        left: '20',
      },
    },
  };
}

export function generateButtonBlock(bgColor) {
  const timestamp = Date.now();
  return {
    blockId: `button-${timestamp}`,
    type: 'button',
    properties: {
      text: 'Botón',
      href: '',
      backgroundColor: bgColor,
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
  };
}
