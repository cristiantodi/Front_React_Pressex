import pdfMake from "pdfmake/build/pdfmake";

import pdfFonts from "./vfs_fonts";
import logo from "../../img/logo.png";

pdfMake.vfs = pdfFonts;

const GenerateBillPDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();

  return new Promise((resolve, reject) => {
    
    const chargesAmount = [];
    const chargesQuantity = [];
    const chargesTotalAmount = [];
    const chargesDescription = [];
    let totalAmount = 0;

    if (data.billCharges) {
      totalAmount = data.billCharges.leng;
      let chargeAmount = "";
      let chargeQuantity = "";
      let chargeTotalAmount = "";
      let chargeDescription = "";

      data.billCharges?.forEach((chargeses, index) => {
        chargeAmount += `${chargeses.amount}  \n`;
        chargeQuantity += `${chargeses.quantity}  \n`;
        chargeTotalAmount += `${chargeses.totalAmount} \n`;
        chargeDescription += `${chargeses.typeByCode} \n`;
      });
      const chargesRow = [

        {
          text: chargeAmount,
        },
      ];

      const chargesAmoun = [
        {
          text: chargeQuantity,
        },
      ];

      const chargesTotalAmoun = [
        {
          text: chargeTotalAmount,
        },
      ];

      const chargeDescript = [
        {
          text: chargeDescription,
        },
      ];

      chargesAmount.push(chargesRow);
      chargesQuantity.push(chargesAmoun);
      chargesTotalAmount.push(chargesTotalAmoun);
      chargesDescription.push(chargeDescript);
    }


    if (data.billCharges) {
      data.billCharges.forEach((charge) => {
        if (charge.show && charge.type !== "expense") {

          
          const chargeRow = [
            {
              text: charge.type, // Display the charge type
              margin: [0, 0, 0, 0],
            },
            {
              text: charge.description,
              margin: [0, 0, 0, 0],
            },
            {
              text: `${parseInt(charge.totalAmount)}`, // Display the totalAmount and currency
              margin: [0, 0, 0, 0],
            },
          ];
        }
      });
    }


    fetch(logo)
      .then((response) => response.blob())
      .then((imageBlob) => {

        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target.result;

          const pdf = {
            content: [
              {
                columns: [
                  {
                    stack: [
                      {
                        image: imgUrl,
                        fit: [100, 100],
                      },
                      {
                        text: "Bill to",
                        fontSize: 16,
                        bold: true,
                        margin: [0, 15, 0, 15], // Adjust margin as needed
                      },
                    ],
                  },
                  {
                    stack: [
                      
                            {
                              fontSize: 16,
                              bold: true,
                              text: [
                                `PressEx Logistics`,
                              ],
                            },
                            {
                              fontSize: 10,
                              fit:500,
                              text: [
                                `2020 NW 129th. Ave. Suite. 201 Miami`,
                              ],
                            },
                            {
                              fontSize: 10,
                              text: [
                                `Florida 33182 United Stated,`,
                              ],
                              },
                            {
                              fontSize: 10,
                              text: [
                                `Tel: (3054567884), Fax: 786-9998847`,
                              ],
                            }
                    ]
                   
                  },
                  {},
                ],
              },
              //---------------------------------------------------------
              {
                table: {
                  widths: [`30%`, `70%`],
                  body: [
                    [
                      {
                        text: `Date`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text:  `${data.due || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],  
                    [
                      {
                        text: `Due Date`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.trasaDate || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],  
                    [
                      {
                        text: `Number`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text:  `${data.number || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],  
                  ],
                },
              },
              { margin: [0, 10, 0, 10],
                table: {
                  widths: [`30%`, `70%`],
                  body: [
                    [
                      {
                        text: `Payment Terms`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.paymentByDesc || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                      
                    ],  
                    [
                      {
                        text: `PREUBA`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                        rowSpan: 1,
                      },
                      {
                      },
                    ],  
                    
                  ],
                },
              },
              //---------------------------------------------------------
              {
                table: {
                  widths: [`40%`, `20%`, `20%`, `20%`],
                  body: [
                    [
                      {
                        text: `Description of Charges`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Quantity`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Price`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      
                      {
                        text: `Amount`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                    ],
                  
                    [
                      [chargesDescription,],
                      [chargesQuantity,],
                      [chargesTotalAmount],
                      [chargesAmount,],
                      
                    ],
                    [
                      
                      {
                        text: `TOTAL (USD):`,
                        alignment: `center`,
                        colSpan: 3,
                        rowSpan: 1,
                      },
                      {},
                      {},
                      {
                        text: 
                        `${data.division || ``}`,
                      },
                    ],
                    
       
                    ],
                },
              },
              {
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 5],
              },
              subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
              },
              tableExample: {
                margin: [0, 0, 0, 5],
                alignment: `right`,
                width: `100%`,
              },
              tableExampleLeft: {
                margin: [0, 0, 0, 5],
                alignment: `left`,
                width: `100%`,
              },
              tableHeader: {
                bold: true,
                fontSize: 13,
                color: `black`,
              },
            },
            defaultStyle: {
              fontSize: 10, // Set the desired font size here (e.g., 10)
            },
          };


          const pdfGenerator = pdfMake.createPdf(pdf);
          pdfGenerator.getBlob((blob) => {
            const pdfUrl = URL.createObjectURL(blob);
            resolve(pdfUrl);
          });
        };
        reader.readAsDataURL(imageBlob); // Read the logo image
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default GenerateBillPDF;


