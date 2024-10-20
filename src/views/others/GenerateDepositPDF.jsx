import pdfMake from "pdfmake/build/pdfmake";

import pdfFonts from "./vfs_fonts";
import logo from "../../img/logo.png";

pdfMake.vfs = pdfFonts;

const GenerateDepositPDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();

  return new Promise((resolve, reject) => {

    const chargesAmount = [];
    const chargesQuantity = [];
    const chargesTotalAmount = [];
    const chargesDescription = [];
    let totalAmount = 0;

    if (data.depositCharges) {
      totalAmount = data.depositCharges.leng;
      let chargeAmount = "";
      let chargeQuantity = "";
      let chargeTotalAmount = "";
      let chargeDescription = "";

      data.depositCharges?.forEach((chargeses, index) => {
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


    if (data.depositCharges) {
      data.depositCharges.forEach((charge) => {
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
                        text: "Deposit Ticket",
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
                        text:  `${data.creation_date || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],  
                    [
                      {
                        text: `Account Name`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.bankAccount || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],  
                    [
                      {
                        text: `Account Number`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: ``,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],  
                  ],
                },
              },
              // --------------------------------------------------------------------------------
              { margin: [0, 10, 0, 10],
                table: {
                  widths: [`30%`, `70%`],
                  body: [
                    [
                      {
                        text: `Memo`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text:  `${data.memo || ``}`,
                        bold: true,
                        margin: [0, 0, 0, 0],
                      },
                    ],  
                    
                  ],
                },
              },
              //---------------------------------------------------------------------------------
              {
                table: {
                  widths: [`20%`, `60%`, `20%`],
                  heights: [`100vh`,`100vh`, `100vh`],
                  body: [
                    [
                      {
                        text: `Number`,
                        alignment: `center`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `References`,
                        alignment: `center`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Amount`,
                        alignment: `center`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                    ],
                  
                    [
                      {
                        text: chargesDescription[0],
                        alignment: `center`,
                        bold: true,
                        // fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: chargesQuantity[0],
                        alignment: `center`,
                        bold: true,
                        // fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: chargesAmount[0],
                        alignment: `center`,
                        bold: true,
                        // fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                    ],
                    [
                      { 
                        text: `TOTAL :`,
                        alignment: `center`,
                        colSpan: 2,
                        rowSpan: 1,
                      },
                      {},
                      {
                        text: `${data.total || ``}`,
                        alignment: `center`,
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

export default GenerateDepositPDF;


