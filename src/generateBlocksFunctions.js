
export function generateTextButtonStructure() { 
    const timestamp = Date.now(); // Generar un timestamp para IDs únicos
    return [
      {
        blockId: `text-${timestamp}-1`,
        type: 'text',
        properties: {
          text: '<p style="text-align:center; margin:0; "><span style="color:#004481;font-size:17px;"><strong>Encabezado de ejemplo</strong></span></p>',
          fontSize: '14px',
          color: '#000000',
          containerPadding: {
            top: '10px',
            right: '10px',
            bottom: '10px',
            left: '10px',
          }
        }
      },
      {
        blockId: `button-${timestamp}-2`,
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
            top: '10px',
            right: '10px',
            bottom: '10px',
            left: '10px',
          }
        }
      },
      {
        blockId: `text-${timestamp}-3`,
        type: 'text',
        properties: {
          text: '<p style="text-align:center; margin:0"><span style="color:#004481;font-size:14px;">Este texto es de ejemplo. Haciendo clic puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>',
          fontSize: '14px',
          color: '#000000',
          containerPadding: {
            top: '10',
            right: '10',
            bottom: '10',
            left: '10',
          }
        }
      }
    ];
  }


// footerConfig.js

export function generateFooterStructure() {
  const timestamp = Date.now();
  
  return {
    columns: [
      {
        backgroundColor: "#072146",
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        border: {
          width: { top: 0, right: 0, bottom: 0, left: 0 },
          color: { top: "#000", right: "#000", bottom: "#000", left: "#000" }
        },
        content: [
          {
            blockId: `text-${timestamp}`,
            type: "text",
            properties: {
              text: "<p style=\"text-align:center; margin: 0;\"><span style=\"color:#FFFFFF;\">La presente comunicación y su contenido va dirigida a empleados del Grupo BBVA.</span></p>",
              fontSize: "14px",
              color: "#000000",
              containerPadding: { top: "10", right: "10", bottom: "10", left: "10" }
            }
          }
        ]
      }
    ]
  };
}

export function generateThreeSevenStructure() { 
  const timestamp = Date.now();
  return {
    isSelected: true,
    columns: [
      {
        content:[
          {
            blockId:`image-${timestamp}`,
            type:"image",
            properties:{
              src:"https://picsum.photos/id/237/536/354",
              alt:"Imagen de ejemplo",
              href:"",
              width:100,
              height:"auto",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{"top":0,"right":0,"bottom":0,"left":0},
        border:{
          width:{top:0,right:0,bottom:0,left:0},
          color:{top:"#000",right:"#000",bottom:"#000",left:"#000"}
        },
        width:33
      },
      {
        content:[
          {
            blockId:`text-${timestamp}-1`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center;; margin: 0;\"><span style=\"color:#004481;font-size:17px;\"><strong>Encabezado de ejemplo</strong></span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`text-${timestamp}-2`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center; margin: 0;\"><span style=\"color:#004481;font-size:14px;\">Este texto es de ejemplo. Haciendo clic puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`button-${timestamp}`,
            type:"button",
            properties:{
              text:"Botón",
              href:"",
              backgroundColor:"#1973b8",
              color:"#FFFFFF",
              padding:"12px 32px",
              borderRadius:"1px",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{top:0,right:0,bottom:0,left:0},
        border:{
          width:{top:0,right:0,bottom:0,left:0},
          color:{top:"#000",right:"#000",bottom:"#000",left:"#000"}
        },
        width:67
      }
    ]
  }
}

export function generateSevenThreeStructure() { 
  const timestamp = Date.now();
  return {
    isSelected: true,
    columns: [
      {
        content:[
          {
            blockId:`text-${timestamp}-1`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center;; margin: 0;\"><span style=\"color:#004481;font-size:17px;\"><strong>Encabezado de ejemplo</strong></span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`text-${timestamp}-2`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center; margin: 0;\"><span style=\"color:#004481;font-size:14px;\">Este texto es de ejemplo. Haciendo clic puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`button-${timestamp}`,
            type:"button",
            properties:{
              text:"Botón",
              href:"",
              backgroundColor:"#1973b8",
              color:"#FFFFFF",
              padding:"12px 32px",
              borderRadius:"1px",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{top:0,right:0,bottom:0,left:0},
        border:{
          width:{top:0,right:0,bottom:0,left:0},
          color:{top:"#000",right:"#000",bottom:"#000",left:"#000"}
        },
        width:67
      },
      {
        content:[
          {
            blockId:`image-${timestamp}`,
            type:"image",
            properties:{
              src:"https://picsum.photos/id/237/536/354",
              alt:"Imagen de ejemplo",
              href:"",
              width:100,
              height:"auto",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{"top":0,"right":0,"bottom":0,"left":0},
        border:{
          width:{top:0,right:0,bottom:0,left:0},
          color:{top:"#000",right:"#000",bottom:"#000",left:"#000"}
        },
        width:33
      }
    ]
  }
}

export function generateThreeSevenWithMarginStructure() { 
  const timestamp = Date.now();
  return {
    isSelected: true,
    columns: [
      {
        content:[
          {
            blockId:`image-${timestamp}`,
            type:"image",
            properties:{
              src:"https://picsum.photos/id/237/536/354",
              alt:"Imagen de ejemplo",
              href:"",
              width:100,
              height:"auto",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{"top":0,"right":0,"bottom":0,"left":0},
        border:{
          width:{top:12,right:0,bottom:12,left:20},
          color:{top:"#fff",right:"#fff",bottom:"#fff",left:"#fff"}
        },
        width:33
      },
      {
        content:[
          {
            blockId:`text-${timestamp}-1`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center;; margin: 0;\"><span style=\"color:#004481;font-size:17px;\"><strong>Encabezado de ejemplo</strong></span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`text-${timestamp}-2`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center; margin: 0;\"><span style=\"color:#004481;font-size:14px;\">Este texto es de ejemplo. Haciendo clic puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`button-${timestamp}`,
            type:"button",
            properties:{
              text:"Botón",
              href:"",
              backgroundColor:"#1973b8",
              color:"#FFFFFF",
              padding:"12px 32px",
              borderRadius:"1px",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{top:0,right:0,bottom:0,left:0},
        border:{
          width:{top:12,right:20,bottom:12,left:0},
          color:{top:"#fff",right:"#fff",bottom:"#fff",left:"#fff"}
        },
        width:67
      }
    ]
  }
}

export function generateSevenThreeWithMarginStructure() { 
  const timestamp = Date.now();
  return {
    isSelected: true,
    columns: [
      {
        content:[
          {
            blockId:`text-${timestamp}-1`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center;; margin: 0;\"><span style=\"color:#004481;font-size:17px;\"><strong>Encabezado de ejemplo</strong></span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`text-${timestamp}-2`,
            type:"text",
            properties:{
              text:"<p style=\"text-align:center; margin: 0;\"><span style=\"color:#004481;font-size:14px;\">Este texto es de ejemplo. Haciendo clic puedes editarlo y darle formato según las necesidades de tu newsletter.</span></p>",
              fontSize:"14px",
              color:"#000000",
              containerPadding:{"top":"10","right":"10","bottom":"10","left":"10"}
            }
          },
          {
            blockId:`button-${timestamp}`,
            type:"button",
            properties:{
              text:"Botón",
              href:"",
              backgroundColor:"#1973b8",
              color:"#FFFFFF",
              padding:"12px 32px",
              borderRadius:"1px",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{top:0,right:0,bottom:0,left:0},
        border:{
          width:{top:12,right:0,bottom:12,left:20},
          color:{top:"#fff",right:"#fff",bottom:"#fff",left:"#fff"}
        },
        width:67
      },
      {
        content:[
          {
            blockId:`image-${timestamp}`,
            type:"image",
            properties:{
              src:"https://picsum.photos/id/237/536/354",
              alt:"Imagen de ejemplo",
              href:"",
              width:100,
              height:"auto",
              aligment:"center",
              containerPadding:{top:"10",right:"10",bottom:"10",left:"10"}
            }
          }
        ],
        backgroundColor:"#f0f0f0",
        padding:{"top":0,"right":0,"bottom":0,"left":0},
        border:{
          width:{top:12,right:20,bottom:12,left:0},
          color:{top:"#fff",right:"#fff",bottom:"#fff",left:"#fff"}
        },
        width:33
      }
    ]
  }
}
  