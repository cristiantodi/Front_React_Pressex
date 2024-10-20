import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";

pdfMake.vfs = pdfFonts;

const GenerateReceiptPDF = (data, numCon) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();

  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;

    // # Obtener la fecha y la hora por separado
    let dataCreation = new Date(data.creation_date);
    let year = dataCreation.getFullYear();
    let month = String(dataCreation.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
    let day = String(dataCreation.getDate()).padStart(2, '0');
    let hours = dataCreation.getHours();
    let minutes = String(dataCreation.getMinutes()).padStart(2, '0');
    
    // Determinar AM o PM
    let ampm = hours >= 12 ? 'Pm' : 'Am';
    
    // Convertir horas de 24 horas a 12 horas
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora 0 debería ser 12
    
    // Formato: YYYY-MM-DD HH:MM AM/PM
    let formattedDateTime = `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;

    canvas = document.createElement('canvas');
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128),
      text: data.number + '',
      scale: 4, // Scale factor for the barcode size
      height: 5, // Height of the barcode
    };
    barcodeOptions.text = barcodeOptions.text.toUpperCase();
    try {

      canvas = bwipjs.toCanvas(canvas, barcodeOptions);
      barcodeImage = canvas.toDataURL();
    } catch (error) {
      reject(error);
    }
    const commodityRows = [];
    let totalPieces = 0;
    let totalWeight = 0.0;
    let totalVolume = 0.0;
    let totalVolumeM = 0.0;
    let longboard = 302.0;
    let hazardous = "";
    let hazardousA = "";
    let hazardous_type = "";

    if (data.commodities) {
      totalPieces = data.commodities.length;
      let firstRowText = "";
      let thirdRowText = "";
      let fourthRowText = "";
      let sixthRowText = "";
      let seventhRowText = "";

      data.commodities?.forEach((commodity, index) => {
        firstRowText    += `1; ${commodity.package_type_description}\n \n \n`;
        thirdRowText    += `${commodity.length}x${commodity.width}x${commodity.height} in \n \n \n`;
        fourthRowText   += `${commodity.description} \n \n \n`;
        sixthRowText    += `${commodity.weight} lbs \n` +`${(commodity.weight / 2.205).toFixed(2)} Kg \n \n`;
        seventhRowText  += `${commodity.volumetricWeight} Vlb \n` +`${commodity.volumen} ft3 \n \n`;
        totalWeight     += parseFloat(commodity.weight);
        totalVolume     += parseFloat(commodity.volumetricWeight);
        totalVolumeM    += parseFloat(commodity.volumen);
        hazardous       += `${commodity.hazardous}`;
        hazardous_type  += `${commodity.hazardous_type}`;
        longboard       -= 37;
        if (hazardous=="true"){
          hazardousA = hazardous;
        }
         
      });
      const commodityRow = [
        {
          text: firstRowText,
          colSpan: 2,
        },
        {},
        {
          text: thirdRowText,
        },
        {
          text: fourthRowText,
          colSpan: 2,
        },
        {},
        {
          text: sixthRowText,
        },
        {
          text: seventhRowText,
          margin: [0, 0, 0, longboard],
        },
      ];
      commodityRows.push(commodityRow);
    }
    const chargeRows = [];

    if (data.charges) {
      data.charges.forEach((charge) => {
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
              text: `$${parseInt(charge.totalAmount)} ${charge.currency}`, // Display the totalAmount and currency
              margin: [0, 0, 0, 0],
            },
          ];
          chargeRows.push(chargeRow);
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
                    margin: [0, 0, -10, 0],
                    stack: [
                      {
                        image: imgUrl,
                        fit: [100, 100],
                      },
                      
                    ],
                  },
                  {
                    margin: [-65, 0, 10, 0],
                    bold: true,
                   text: [
                          `${data.issued_byObj?.name || ``} \n`,
                          `${data.issued_byObj?.phone? `Tel: ${data.issued_byObj.phone || ``}, \n `: ``}
                          ${data.issued_byObj?.fax? `Fax: ${data.issued_byObj.fax || ``}`: ``}\n`,
                          `${data.issued_byObj?.street_and_number || ``} \n`,
                          `${data.issued_byObj?.country || ``} \n`,
                          `${data.issued_byObj?.state || ``} \n`,
                          `${data.issued_byObj?.city || ``} \n`,
                          `${data.issued_byObj?.zip_code || ``} \n`,   
                        ],
                  },
                  {
                      style: `tableExample`,
                      margin: [-30, 0, 0, 5],
                      table: {
                        body: [
                          [
                            {text: "Warehouse Receipt",
                            alignment: "center",
                            fontSize: 18,
                            border: ['', '', '', ''],
                            colSpan: 2,
                            bold: true,
                            margin: [16, 0, 20, 0],
                            }, 
                            {
                            }
                          ],
                          [
                            {
                              border: ['', '', '', ''],
                              colSpan: 2,
                              stack: [
                                {
                                  image: barcodeImage,
                                  fit: [1000, 50],
                                  alignment: `center`,
                                },
                              ],
                            },
                            {
                            }
                          ],
                        
                          [`Receipt Number`, `${data.number || ``}`],
                          [`Received Date`, formattedDateTime],
                          [`Received By`, `${data.employeeObj?.name || ``}`]
                        ],
                        margin: [0, 0, 50, 0],
                      },
                  },                  
                ],
              },
              {
                table: {
                  widths: [`15%`, `35%`, `15%`, '35%'],
                  body: [
                    [
                      {
                        text: `Shipper Information`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                      {
                        text: `Consignee Information`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {
                        text: [
                          `${data.shipperObj?.data?.obj?.name || ``} \n`,
                          `${data.shipperObj?.data?.obj?.street_and_number || ``} \n`,
                          `${data.shipperObj?.data?.obj?.city || ``}, 
                           ${data.shipperObj?.data?.obj?.state || ``} 
                           ${data.shipperObj?.data?.obj?.zip_code || ``} \n`,
                          `${data.shipperObj?.data?.obj?.country || ``}`,
                          `${data.shipperObj?.phone? `Tel: ${data.shipperObj.phone}, `: `\n`}
                           ${data.shipperObj?.fax? `Fax: ${data.shipperObj.fax}`: ``}`,
                        ],
                        colSpan: 2
                      },
                      {},
                      {
                        text: [
                          `${data.consigneeObj?.data?.obj?.name || ``} \n`,
                          `${data.consigneeObj?.data?.obj?.street_and_number || ``} \n`,
                          `${data.consigneeObj?.data?.obj?.city || ``}, 
                           ${data.consigneeObj?.data?.obj?.state || ``} 
                           ${data.consigneeObj?.data?.obj?.zip_code || ``} \n`,
                          `${data.consigneeObj?.data?.obj?.country || ``}`,
                          `${data.consigneeObj?.phone? `Tel: ${data.consigneeObj.phone}, `: `\n`}
                           ${data.consigneeObj?.fax? `Fax: ${data.consigneeObj.fax}`: ``}`,
                        ],
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {
                        text: "Inland and Supplier Information",
                        margin: [0, 0, 0, 0],
                        bold: true,
                        fillColor: `#CCCCCC`,
                        colSpan: 4,
                        alignment: "center"
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        text: `Carrier Name`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.inland_carrierObj?.name || ``}`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Suppliers Name`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.supplierObj?.data?.obj?.name || ``}`,
                        margin: [0, 0, 0, 0],
                      }
                    ],
                    [
                      {
                        text: `PRO Number`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.pro_number || ``}`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Tracking Numb.`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.tracking_number || ``}`,
                        margin: [0, 0, 0, 0],
                      }
                    ],
                    [
                      {
                        text: `Invoice Number`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.invoice_number || ``}`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `P.O Number`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `${data.pro_number || ``}`,
                        margin: [0, 0, 0, 0],
                      }
                    ],
                    [
                      {
                        text: `Hazardous Material`,
                        border: ['top', 'top', 'top', ''],
                      },
                      {
                        text: hazardousA.toUpperCase(),
                        border: ['top', 'top', 'top', ''],
                      },
                      {
                        text: `Hazardous Type`,
                        border: ['top', 'top', 'top', ''],
                      },
                      {
                        text: hazardous_type.toUpperCase(),
                        border: ['top', 'top', 'top', ''],
                      },
                    ],
                    [
                      {
                        text: `Notes`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                      {
                        text: `Applicable Charges`,
                        bold: true,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {
                        text: `${data.notes || ``}`,
                        rowSpan: 2,
                        colSpan: 2
                      },
                      {},
                      {
                        style: `tableExampleLeft`,
                        table: {
                          widths: ["28%", "40%", "32%"],
                          body: [
                            [...chargeRows,]
                          ],
                        },
                        rowSpan: 2,
                        colSpan: 2
                      },
                      {},
                    ],
                    [
                      {},
                      {},
                      {},
                      {},
                    ],
                  ],
                },
              },
              {
                table: {
                  widths: [`5%`, `10%`, `20%`, `30%`, `10%`, `10%`, `15%`],
                  body: [
                    [
                      {
                        text: `Pcs`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Package`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Dimensions`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Description`,
                        fillColor: `#CCCCCC`,
                        colSpan: 2,
                        margin: [0, 0, 0, 0],
                      },
                      {},
                      {
                        text: `Weight`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        rowSpan: 3,
                        alignment: "center"
                      },
                      {
                        text: `Volume`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        rowSpan: 3,
                        alignment: "center"
                      },
                    ],
                    [
                      {
                        text: `Location`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {
                        text: `Invoice Number`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Notes`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {},
                      {},
                    ],
                    [
                      {
                        text: `Quantity`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {
                        text: `PO Number`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        text: `Part Number / Model / Serial Number`,
                        fillColor: `#CCCCCC`,
                        margin: [0, 0, 0, 0],
                        colSpan: 2,
                      },
                      {},
                      {},
                      {},
                    ],
                    ...commodityRows,
                    [
                      {
                        text: `Signature:`,
                        colSpan: 4,
                        rowSpan: 2,
                      },
                      {},
                      {},
                      {},
                      {
                        text: `Pieces`,
                      },
                      {
                        text: `Weight`,
                      },
                      {
                        text: [`volume`],
                      },
                    ],
                    [
                      {},
                      {},
                      {},
                      {},
                      {
                        text: totalPieces,
                      },
                      {
                        text: [
                          `${totalWeight.toFixed(2)} lb\n`,
                          `${(totalWeight / 2.205).toFixed(2)} kg`,
                        ],
                      },
                      {
                        text: [
                          `${totalVolume.toFixed(2)} Vlb\n`,
                          `${(totalVolumeM).toFixed(2)} ft3`,
                        ],
                      },
                    ],
                  ],
                },
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

export default GenerateReceiptPDF;
