import {
  Alignment,
  Bold,
  Italic,
  Link,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageBlockEditing,
  Paragraph,
  Underline,
  Mention,
  Clipboard,
  Font,
} from 'ckeditor5';

export const colors = [
  { label: 'navy', color: '#072146' },
  { label: 'dark-navy', color: '#041836' },
  { label: 'dark-core-blue', color: '#043263' },
  { label: 'core-blue', color: '#004481' },
  { label: 'white-core-blue', color: '#1464A5' },
  { label: 'white-core-blue-new', color: '#5BBEFF' },
  { label: 'dark-medium-blue', color: '#1464A5' },
  { label: 'medium-blue', color: '#1973B8' },
  { label: 'white-medium-blue', color: '#49A5E6' },
  { label: 'dark-light-blue', color: '#49A5E6' },
  { label: 'light-blue', color: '#5BBEFF' },
  { label: 'white-light-blue', color: '#D4EDFC' },
  { label: 'aqua', color: '#2DCCCD' },
  { label: 'dark-aqua', color: '#028484' },
  { label: 'med-aqua', color: '#02a5a5' },
  { label: 'light-aqua', color: '#5AC4C4' },
  { label: 'white-aqua', color: '#EAF9FA' },
  { label: '600', color: '#121212' },
  { label: '500', color: '#666666' },
  { label: '400', color: '#BDBDBD' },
  { label: '300', color: '#D3D3D3' },
  { label: '200', color: '#E9E9E9' },
  { label: '100', color: '#F4F4F4' },
  { label: 'white', color: '#FFFFFF' },
  { label: 'white-50', color: 'rgba(255,255,255,0.5)' },
  { label: 'dark-red', color: '#B92A45' },
  { label: 'red', color: '#DA3851' },
  { label: 'medium-red', color: '#C0475E' },
  { label: 'light-red', color: '#E77D8E' },
  { label: 'white-red', color: '#F4C3CA' },
  { label: 'dark-orange', color: '#C65302' },
  { label: 'orange', color: '#F7893B' },
  { label: 'medium-orange', color: '#D8732C' },
  { label: 'light-orange', color: '#FAB27F' },
  { label: 'white-orange', color: '#FDE7D8' },
  { label: 'dark-yellow', color: '#9C6C01' },
  { label: 'yellow', color: '#F8CD51' },
  { label: 'medium-yellow', color: '#C49735' },
  { label: 'light-yellow', color: '#FADE8E' },
  { label: 'white-yellow', color: '#FEF5DC' },
  { label: 'dark-coral', color: '#CB353A' },
  { label: 'coral', color: '#F35E61' },
  { label: 'medium-coral', color: '#D44B50' },
  { label: 'light-coral', color: '#F59799' },
  { label: 'white-coral', color: '#FCDFDF' },
  { label: 'dark-gold', color: '#8E7022' },
  { label: 'gold', color: '#D8BE75' },
  { label: 'medium-gold', color: '#B79E5E' },
  { label: 'light-gold', color: '#E6D5A5' },
  { label: 'white-gold', color: '#F3EBD5' },
  { label: 'dark-coral', color: '#D44B50' },
  { label: 'coral', color: '#F35E61' },
  { label: 'light-coral', color: '#F79697' },
  { label: 'white-coral', color: '#FDDFDF' },
  { label: 'dark-green', color: '#277A3E' },
  { label: 'green', color: '#48AE64' },
  { label: 'medium-green', color: '#388D4F' },
  { label: 'light-green', color: '#88CA9A' },
  { label: 'white-green', color: '#D9EFE0' },
  { label: 'dark-pink', color: '#AD53A1' },
  { label: 'pink', color: '#F78BE8' },
  { label: 'medium-pink', color: '#C569B9' },
  { label: 'light-pink', color: '#FAB3F0' },
  { label: 'white-pink', color: '#FDDCF8' },
  { label: 'dark-purple', color: '#6754B8' },
  { label: 'purple', color: '#8F7AE5' },
  { label: 'medium-purple', color: '#7C6AC7' },
  { label: 'light-purple', color: '#B6A8EE' },
  { label: 'white-purple', color: '#DDD7F7' },
];

export const ckeditorConfig = {
  plugins: [
    Bold,
    Link,
    Italic,
    Underline,
    Mention,
    Paragraph,
    Alignment,
    Font,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageBlockEditing,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    Clipboard,
  ],
  toolbar: [
    'fontsize',
    'fontFamily',
    'fontColor',
    'fontBackgroundColor',
    '|',
    'alignment:left',
    'alignment:center',
    'alignment:right',
    'alignment:justify',
    '|',
    'bold',
    'italic',
    'underline',
    '|',
    'link',
  ],
  image: {
    resizeUnit: 'px',
    toolbar: ['imageStyle:inline', '|', 'resizeImage'],
    insert: {
      type: 'inline',
    },
  },
  fontSize: {
    options: [
      { title: 11, model: '11px' },
      { title: 12, model: '12px' },
      { title: 13, model: '13px' },
      { title: 14, model: '14px' },
      { title: 15, model: '15px' },
      { title: 17, model: '17px' },
      { title: 20, model: '20px' },
      { title: 22, model: '22px' },
      { title: 24, model: '24px' },
      { title: 26, model: '26px' },
      { title: 28, model: '28px' },
      { title: 30, model: '30px' },
      { title: 32, model: '32px' },
    ],
  },
  fontFamily: {
    options: ['Arial', 'Georgia', 'sans-serif'],
  },
  fontColor: {
    columns: 8,
    documentColors: colors.length,
    colors,
  },
  fontBackgroundColor: {
    columns: 8,
    documentColors: colors.length,
    colors,
  },
  link: {
    addTargetToExternalLinks: true,
  },
};

export const MAX_WIDTH_IMAGE = 900;

export function resolveWithHeightResizedImage(originalWidth, originalHeight) {
  // Resize the image
  let width = originalWidth;
  let height = originalHeight;

  if (width > height) {
    if (width > MAX_WIDTH_IMAGE) {
      height *= MAX_WIDTH_IMAGE / width;
      width = MAX_WIDTH_IMAGE;
    }
  } else {
    if (height > MAX_WIDTH_IMAGE) {
      width *= MAX_WIDTH_IMAGE / height;
      height = MAX_WIDTH_IMAGE;
    }
  }

  return { width, height };
}
