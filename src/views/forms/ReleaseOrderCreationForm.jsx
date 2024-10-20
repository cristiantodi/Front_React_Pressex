import { useEffect, useState } from 'react';
import CarrierService from '../../services/CarrierService';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ForwardingAgentService from '../../services/ForwardingAgentService';
import CustomerService from '../../services/CustomerService';
import VendorService from '../../services/VendorService';
import EmployeeService from '../../services/EmployeeService';
import Input from '../shared/components/Input';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ReceiptService from '../../services/ReceiptService';
import AsyncSelect from 'react-select/async';
import ReleaseService from '../../services/ReleaseService';
import Table from '../shared/components/Table';
import PickupService from '../../services/PickupService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mammoth from 'mammoth';
import {
    faFile,
    faFileExcel,
    faFilePdf,
    faFileWord,
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import ConfirmModal from '../shared/components/ConfirmModal';
import { set } from 'lodash';

const ReleaseOrderCreationForm = ({
    releaseOrder,
    closeModal,
    creating,
    onReleaseOrderDataChange,
    currentReleaseNumber,
    setcurrentReleaseNumber,
    fromRecipt,
}) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [allStateUpdatesComplete, setAllStateUpdatesComplete] =
        useState(false);
    const [issuedByOptions, setIssuedByOptions] = useState([]);
    const [carrierOptions, setCarrierOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [releasedToOptions, setReleasedToOptions] = useState([]);
    const [clientToBill, setClientToBill] = useState(null);
    const [releasedTo, setReleasedTo] = useState(null);
    const today = dayjs().format('YYYY-MM-DD hh:mm A');
    const pickupNumber = currentReleaseNumber ? currentReleaseNumber + 1 : 1;
    const [canRender, setcanRender] = useState(false);
    const [commodities, setcommodities] = useState([]);
    const [releaseIDs, setreleaseIDs] = useState([]);
    const [selectedReceipts, setSelectedReceipts] = useState([]);
    const [selectedCommodities, setSelectedCommodities] = useState([]);
    const [warehouseReceipts, setWarehouseReceipts] = useState([]);
    const [weightUpdated, setWeightUpdated] = useState(0);
    const [consigneeOptions, setConsigneeOptions] = useState([]);
    const [consignee, setconsignee] = useState(null);
    const [consigneeRequest, setconsigneeRequest] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [showModalConfirm, setShowModalConfirm] = useState(false);

    const [customerByOptions, setCustomerByOptions] = useState([]); //mirar

    

    const StatusDelivered = 9;
    const formFormat = {
        status: StatusDelivered,
        number: pickupNumber,
        createdDateAndTime: today,
        release_date: today,
        employeeId: '',
        issuedById: '',
        issuedByType: '',
        /* releasedToId: "",
        releasedToType: "",
        releasedToInfo: "", */
        clientToBillId: '',
        clientToBillType: '',
        carrierId: '',
        pro_number: '',
        tracking_number: '',
        purchase_order_number: '',
        inland_carrierObj: '',
        commodities: [],
        consigneeId: '',
        consigneeType: '',
        consigneeInfo: '',
        notes: '',

        customerById: '', //Cristian
        customerByName: '',
        wh_receipt_id: '',
    };

    const [formData, setFormData] = useState(formFormat);

    const handleClientToBillSelection = async (event) => {
        const type = event.target?.value;
        if (type) {
            if (type === 'releasedTo') {
                setFormData({
                    ...formData,
                    clientToBillType: formData.releasedToType,
                    clientToBillId: formData.releasedToId,
                });
            } else {
                setFormData({ ...formData, clientToBillType: 'other' });
            }
        } else {
            const id = event.id;
            const type = event.type;

            setFormData({
                ...formData,
                clientToBillType: type,
                clientToBillId: id,
            });
        }
    };

    //added consignee
    const handleConsigneeSelection = async (event) => {
        const id = event?.id || '';
        const type = event?.type || '';
        const validTypes = ['forwardingAgent', 'customer', 'vendor', 'Carrier'];
        if (!validTypes.includes(type)) {
            console.error(`Unsupported consignee type: ${type}`);
            return;
        }
        const selectedConsignee = consigneeOptions.find(
            (option) => option.id === id && option.type === type
        );
        if (!selectedConsignee) {
            console.error(`Consignee not found with ID ${id} and type ${type}`);
            return;
        }

        const info = `${selectedConsignee.street_and_number || ''} - ${
            selectedConsignee.city || ''
        } - ${selectedConsignee.state || ''} - ${
            selectedConsignee.country || ''
        } - ${selectedConsignee.zip_code || ''}`;
        setconsignee(selectedConsignee);
        setFormData({
            ...formData,
            consigneeId: id,
            consigneeType: type,
            consigneeInfo: info,
        });
    };

    const [showPreview, setShowPreview] = useState(false);

    const [fileContent, setfileContent] = useState({});

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);

        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        name: file.name,
                        base64: reader.result,
                        type: file.type,
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then((newAttachments) => {
            setAttachments((prevAttachments) => [
                ...prevAttachments,
                ...newAttachments,
            ]);
        });
    };

    const handlePreview = async (attachment) => {
        if (
            attachment.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            try {
                const arrayBuffer = convertDataURIToBinary(attachment.base64);
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setfileContent({ ...attachment, htmlContent: result.value });
            } catch (error) {
                console.error('Error processing Word file:', error);
                alert('Error processing Word file. Please try again.');
            }
        } else {
            setfileContent(attachment);
        }
        setShowPreview(true);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setfileContent({});
    };

    const getIcon = (type) => {
        if (type === 'application/pdf') {
            return faFilePdf;
        } else if (
            type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return faFileWord;
        } else if (
            type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return faFileExcel;
        } else {
            return faFile;
        }
    };

    const getColor = (type) => {
        if (type === 'application/pdf') {
            return '#ff0000';
        } else if (
            type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return '#1976d2';
        } else if (
            type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            return '#43a047';
        } else {
            return '#9e9e9e';
        }
    };

    // ----------------------------------------------------------------------------------------
    const handleDeleteAttachment = (name) => {
        const updateAttachments = attachments.filter(
            (attachment) => attachment.name !== name
        );
        setAttachments(updateAttachments);
    };

    const convertDataURIToBinary = (dataURI) => {
        const base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
        const base64 = dataURI.substring(base64Index);
        const raw = atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array.buffer;
    };

    const renderPreviewContent = () => {
        if (fileContent.type.startsWith('image/')) {
            return (
                <img
                    src={fileContent.base64}
                    style={{ width: '60rem' }}
                    alt="Large Preview"
                />
            );
        }
        if (fileContent.type === 'application/pdf') {
            return (
                <iframe
                    src={fileContent.base64}
                    width="100%"
                    height="500px"
                    title="PDF file"
                />
            );
        }

        if (
            fileContent.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            const workbook = XLSX.read(fileContent.base64.split(',')[1], {
                type: 'base64',
            });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const htmlString = XLSX.utils.sheet_to_html(sheet, {
                editable: false,
            });
            return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
        }
        if (
            fileContent.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: fileContent.htmlContent,
                    }}
                />
            );
        }

        return <div>No se puede previsualizar este tipo de archivo</div>;
    };

    useEffect(() => {
        if (!creating && releaseOrder != null) {
            setcommodities(releaseOrder.commodities);
            setAttachments(releaseOrder.attachments);
            customerByOptions.find(
                (option) =>
                    option.id === formData.clientToBillId &&
                    option.type_person === formData.clientToBillType
            );

            let updatedFormData = {
                status: releaseOrder.status,
                number: releaseOrder.number,
                createdDateAndTime: releaseOrder.creation_date,
                release_date: releaseOrder.release_date,
                employeeId: releaseOrder.employee,
                issuedById: releaseOrder.issued_by,
                issuedByType: releaseOrder.issued_byObj?.type_person,

                // client_to_bill: releaseOrder.customerById,//Cristian
                customerById: releaseOrder.clientBillObj.data.obj.id,
                customerByType: releaseOrder.clientBillObj.data.obj.type_person,
                clientToBillId: releaseOrder.clientBillObj.data.obj.id,
                clientToBillType:
                    releaseOrder.clientBillObj.data.obj.type_person,
                consigneeId: releaseOrder.consigneeObj.data?.obj?.id,
                consigneeType: releaseOrder.consigneeObj.data?.obj?.type_person,
                consigneeInfo: `${
                    releaseOrder.consigneeObj?.data?.obj?.street_and_number ||
                    ''
                } - ${releaseOrder.consigneeObj?.data?.obj?.city || ''} - ${
                    releaseOrder.consigneeObj?.data?.obj?.state || ''
                } - ${releaseOrder.consigneeObj?.data?.obj?.country || ''} - ${
                    releaseOrder.consigneeObj?.data?.obj?.zip_code || ''
                }`,
                carrierId: releaseOrder.carrier,
                pro_number: releaseOrder.pro_number,
                tracking_number: releaseOrder.tracking_number,
                purchase_order_number: releaseOrder.purchase_order_number,
                inland_carrierObj: releaseOrder.inland_carrierObj,
                commodities: releaseOrder.commodities,
                notes: releaseOrder.notes,
                wh_receipt_Id: releaseOrder.id,
            };
            setconsignee(releaseOrder.consigneeObj?.data?.obj);
            setconsigneeRequest(releaseOrder.consignee);
            setFormData(updatedFormData);
            setcanRender(true);
        }
    }, [creating, releaseOrder]);

    const SortArray = (x, y) => {
        return new Intl.Collator('es').compare(x.name, y.name);
    };

    const fetchFormData = async () => {
        const forwardingAgents = (
            await ForwardingAgentService.getForwardingAgents()
        ).data.results;
        const customers = (await CustomerService.getCustomers()).data.results;
        const vendors = (await VendorService.getVendors()).data.results;
        const employees = (await EmployeeService.getEmployees()).data.results;
        const carriers = (await CarrierService.getCarriers()).data.results;

        const addTypeToObjects = (arr, type) =>
            arr.map((obj) => ({ ...obj, type }));

        const forwardingAgentsWithType = addTypeToObjects(
            forwardingAgents,
            'forwardingAgent'
        );
        const customersWithType = addTypeToObjects(customers, 'customer');
        const vendorsWithType = addTypeToObjects(vendors, 'vendor');
        const employeesWithType = addTypeToObjects(employees, 'employee');
        const carriersWithType = addTypeToObjects(carriers, 'Carrier');

        const issuedByOptions = [...forwardingAgentsWithType];
        const employeeOptions = [...employeesWithType];
        const releasedToOptions = [
            ...customersWithType,
            ...vendorsWithType,
            ...forwardingAgentsWithType,
            ...carriersWithType,
        ];
        const carrierOptions = [...carriersWithType];
        const consigneeOptions = [
            ...customersWithType,
            ...vendorsWithType,
            ...forwardingAgentsWithType,
            ...carriersWithType,
        ];

        const customerByOptions = [
            ...customersWithType,
            ...forwardingAgentsWithType,
        ]; //Cristian

        issuedByOptions.sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        employeeOptions.sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        carrierOptions.sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        setCustomerByOptions(customerByOptions); //Cristian

        setConsigneeOptions(consigneeOptions);
        setReleasedToOptions(releasedToOptions);
        setIssuedByOptions(issuedByOptions);
        setEmployeeOptions(employeeOptions);
        setCarrierOptions(carrierOptions);
    };

    const addTypeToObjects = (arr, type) =>
        arr.map((obj) => ({ ...obj, type }));

    const loadCustomerBySelectOptions = async (inputValue) => {
        const responseCustomers = (await CustomerService.search(inputValue))
            .data.results;
        const options = [
            ...addTypeToObjects(responseCustomers, 'Customer'),
        ].sort(SortArray);
        return options;
    };

    const loadConsigneeToOptionsSelectOptions = async (inputValue) => {
        const responseCustomers = (await CustomerService.search(inputValue))
            .data.results;
        const responseVendors = (await VendorService.search(inputValue)).data
            .results;
        const responseAgents = (await ForwardingAgentService.search(inputValue))
            .data.results;
        const responseCarriers = (await CarrierService.search(inputValue)).data
            .results;

        const options = [
            ...addTypeToObjects(responseVendors, 'vendor'),
            ...addTypeToObjects(responseCustomers, 'customer'),
            ...addTypeToObjects(responseAgents, 'forwardingAgent'),
            ...addTypeToObjects(responseCarriers, 'Carrier'),
        ].sort(SortArray);

        return options;
    };

    useEffect(() => {
        if (!fromRecipt) {
            fetchFormData();
        }
    }, []);

    const fetchReceipts = async () => {
        ReceiptService.getReceipts()
            .then((response) => {
                const newreceipts = response.data.results;
                setWarehouseReceipts([...newreceipts]);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchFormData();
        fetchReceipts();
    }, []);

    useEffect(() => {
        if (creating) {
            setFormData({ ...formData, number: pickupNumber });
        }
    }, [pickupNumber]);

    useEffect(() => {
        if (commodities.length > 0) {
            setFormData({ ...formData, status: 1 });
        }
    }, [commodities]);

    useEffect(() => {
        //debugger;
        if (fromRecipt) {
            setcommodities(releaseOrder.commodities);
            let updatedFormData = {
                status: releaseOrder.status,
                number: releaseOrder.number,
                createdDateAndTime: today, //releaseOrder.creation_date,
                release_date: today, // releaseOrder.release_date,
                employeeId: releaseOrder.employee,
                issuedById: releaseOrder.issued_byObj?.id,
                issuedByType: releaseOrder.issued_byObj?.type_person,
                wh_receipt_Id: releaseOrder.id,
                // client_to_bill: releaseOrder.customerById, //cristian
                cliento: releaseOrder.customerById, //Cristian
                customerById: releaseOrder.consigneeObj?.data?.obj.id,
                customerByType:
                    releaseOrder.consigneeObj?.data?.obj.type_person,
                clientToBillId:
                    releaseOrder.clientBillObj?.data?.obj?.data?.obj?.id,
                clientToBillType:
                    releaseOrder.clientBillObj?.data?.obj?.data?.obj
                        ?.type_person,
                carrierId: releaseOrder.carrier_by,
                pro_number: releaseOrder.pro_number,
                tracking_number: releaseOrder.tracking_number,
                purchase_order_number: releaseOrder.purchase_order_number,
                inland_carrierObj: releaseOrder.inland_carrierObj,
                commodities: releaseOrder.commodities,
                charges: releaseOrder.charges,
                consignee: releaseOrder.consignee,
                consigneeId: releaseOrder.consigneeObj.data?.obj?.id, //pickupOrder.consignee
                consigneeType: releaseOrder.consigneeObj.data?.obj?.type_person,
                consigneeInfo: `${
                    releaseOrder.consigneeObj?.data?.obj?.street_and_number ||
                    ''
                } - ${releaseOrder.consigneeObj?.data?.obj?.city || ''} - ${
                    releaseOrder.consigneeObj?.data?.obj?.state || ''
                } - ${releaseOrder.consigneeObj?.data?.obj?.country || ''} - ${
                    releaseOrder.consigneeObj?.data?.obj?.zip_code || ''
                }`,
            };
            setconsignee(releaseOrder.consigneeObj?.data?.obj);
            setReleasedTo(releaseOrder.consigneeObj?.data?.obj);
            setconsigneeRequest(releaseOrder.consignee);
            setFormData(updatedFormData);
            setcanRender(true);
        }
    }, [fromRecipt, releaseOrder]);

    const sendData = async () => {
        let clientToBillName = '';

        if (formData.clientToBillType === 'releasedTo') {
            switch (formData.releasedToType) {
                case 'customer':
                    clientToBillName = 'customerid';
                    break;
                case 'vendor':
                    clientToBillName = 'vendorid';
                    break;
                case 'agent':
                    clientToBillName = 'agentid';
                    break;
                case 'carrier':
                    clientToBillName = 'carrierid';
                    break;
                default:
                    break;
            }
        }
        if (formData.clientToBillType === 'customer') {
            clientToBillName = 'customerid';
        }
        if (formData.clientToBillType === 'vendor') {
            clientToBillName = 'vendorid';
        }
        if (formData.clientToBillType === 'agent') {
            clientToBillName = 'agentid';
        }
        if (formData.clientToBillType === 'Carrier') {
            clientToBillName = 'carrierid';
        }
        if (clientToBillName !== '') {
            const clientToBill = {
                [clientToBillName]: formData.clientToBillId,
            };

            const response =
                await ReleaseService.createClientToBill(clientToBill);
            if (response.status === 201) {
                setClientToBill(response.data.id);
            }
        }
        /*
        let consigneeName = '';
        if (formData.consigneeType === 'customer') {
            consigneeName = 'customerid';
        }
        if (formData.consigneeType === 'vendor') {
            consigneeName = 'vendorid';
        }
        if (formData.consigneeType === 'forwardingAgent') {
            consigneeName = 'agentid';
        }
        if (formData.consigneeType === 'Carrier') {
            consigneeName = 'carrierid';
        }
        if (consigneeName !== '') {
            const consignee = {
                [consigneeName]: formData.consigneeId,
            };

            const response = await ReceiptService.createConsignee(consignee);
            if (response.status === 201) {
                setconsigneeRequest(response.data.id);
            }
        }
*/
        //
        if (commodities.length > 0) {
            let totalWeight = 0;
            commodities.forEach((com) => {
                totalWeight += parseFloat(com.weight);
            });
            setWeightUpdated(totalWeight);
        }
    };

    //added  checked release
    const handleSelectRealeaseeChecked = (commodity) => {
        setSelectedCommodities(prevSelected => {
            const commodityIndex = prevSelected.findIndex(item => item.id === commodity.id);
            let newSelected;
            if (commodityIndex !== -1) {
                // Si el commodity ya está en el array, se remueve
                newSelected = prevSelected.filter(item => item.id !== commodity.id);
            } else {
                // Si el commodity no está en el array, se agrega
                newSelected = [...prevSelected, commodity];
            }
            
            // Registrar el nuevo estado de selectedCommodities
            console.log("Commodities seleccionados actualizados:", newSelected);
            
            return newSelected;
        });
    };

    const checkUpdatesComplete = () => {
        if (
            /* releasedTo !== null &&*/ clientToBill !== null &&
            weightUpdated
        ) {
            setAllStateUpdatesComplete(true);
        }
    };

    useEffect(() => {
        checkUpdatesComplete();
        if (allStateUpdatesComplete) {
            let charges = [];

            releaseIDs.forEach((id) => {
                const order = warehouseReceipts.find(
                    (receipt) => receipt.id == id
                );
                charges = [...charges, order.charges];
            });

            // Convertir createdDateAndTime a ISO 8601
            const isoDate = dayjs(
                formData.createdDateAndTime,
                'YYYY-MM-DD hh:mm A'
            ).toISOString();

            // Convertir release_date a ISO 8601
            const isoReleaseDate = dayjs(
                formData.release_date,
                'YYYY-MM-DD hh:mm A'
            ).toISOString();
            const logWithDelay = async (data) => {
                await new Promise((resolve) => setTimeout(resolve, 10000));
            };

            // # Obtener la fecha y la hora por separado
            let dataCreation = new Date(isoDate);
            let year = dataCreation.getFullYear();
            let month = String(dataCreation.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
            let day = String(dataCreation.getDate()).padStart(2, '0');
            let hours = dataCreation.getHours();
            let minutes = String(dataCreation.getMinutes()).padStart(2, '0');
            // Determinar AM o PM
            let ampm = hours >= 12 ? 'P' : 'A';
            // Convertir horas de 24 horas a 12 horas
            hours = hours % 12;
            hours = hours ? hours : 12; // La hora 0 debería ser 12
            // Formato: YYYY-MM-DD HH:MM AM/PM
            let formattedDateTime = `${day}/${month}/${year}-${hours}:${minutes}${ampm}`;
            //-----------------------
            const createPickUp = async () => {
                let rawData = {
                    status: StatusDelivered,
                    number: formData.number,
                    creation_date: isoDate,
                    creation_date_text: formattedDateTime,
                    release_date: isoReleaseDate,
                    employee: formData.employeeId,
                    issued_by: formData.issuedById,
                    issuedByType: formData.issuedByType,
                    clienTo: formData.customerById, //Cristian
                    client_to_bill: clientToBill,
                    /* released_to: releasedTo,
                    releasodToType: formData.releasedToType, */
                    client_to_bill_type: formData.clientToBillType,
                    clientToBillType: formData.clientToBillType,
                    carrier: formData.inland_carrierObj.id,
                    pro_number: formData.pro_number,
                    tracking_number: formData.tracking_number,
                    purchase_order_number: formData.purchase_order_number,
                    inland_carrierObj: formData.inland_carrierObj,

                    commodities: selectedCommodities,
                    wh_receipt_id: formData.wh_receipt_Id,
                    consignee: consigneeRequest,
                    attachments: attachments.map((attachment) => {
                        return {
                            name: attachment.name,
                            type: attachment.type,
                            base64: attachment.base64,
                        };
                    }),
                    notes: formData.notes,
                };
                // Llama a la función de log con retraso
                logWithDelay(rawData);
                //

                const response = await (creating
                    ? (async () => {
                          const createReleaseForm =
                              await ReleaseService.createRelease(rawData);
                        /*   //added change status delivered

                          const buscarrecipt =
                              await ReceiptService.getReceiptById(
                                  releaseOrder.id
                              );
                          const updatedReceiptData = { ...buscarrecipt.data };
                          //
                          updatedReceiptData.status = StatusDelivered;

                          await ReceiptService.updateReceipt(
                              releaseOrder.id,
                              updatedReceiptData
                          );

                          //added change status delivered if have pickup
                          
                          const idPickinRecipt =
                              buscarrecipt.data.pickup_order_id;
                          if (idPickinRecipt !== null) {
                              const buscarpickup =
                                  await PickupService.getPickupById(
                                      idPickinRecipt
                                  );
                              const updatedPickupData = {
                                  ...buscarpickup.data,
                              };
                              updatedPickupData.status = StatusDelivered;
                              await PickupService.updatePickup(
                                  idPickinRecipt,
                                  updatedPickupData
                              );
                          } */

                          // Retornar el resultado de updateReceipt
                          return createReleaseForm;
                      })()
                    : (async () => {
                          const updateInfoRelease =
                              await ReleaseService.updateRelease(
                                  releaseOrder.id,
                                  rawData
                              );

                          return updateInfoRelease;
                      })());

                if (response.status >= 200 && response.status <= 300) {
                    setcurrentReleaseNumber(currentReleaseNumber + 1);
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        closeModal();
                        onReleaseOrderDataChange();
                        setShowSuccessAlert(false);
                        setFormData(formFormat);
                        window.location.href = `/warehouse/release`;
                    }, 1000);
                } else {
                    setShowErrorAlert(true);
                }
            };
            createPickUp();
        }
    }, [allStateUpdatesComplete, weightUpdated]);

    const [colorTab, setcolorTab] = useState(true);
    useEffect(() => {
        const listItems = document.querySelectorAll('.nav-item');
        if (!listItems) return;
        for (const item of listItems) {
            item.addEventListener('click', () => {
                setcolorTab(false);
            });
        }
    }, []);

    return (
        <div className="form-container">
            <div className="company-form release-order">
                <div className="row w-100">
                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>General</h2>
                                <span></span>
                            </div>
                            <div className="row mb-3">
                                <div className="col-4 text-start">
                                    <label className="form-label">
                                        Warehouse number:{' '}
                                    </label>
                                    <div className="col-4 text-start">
                                        <input
                                            className="tex-release"
                                            // type="text"
                                            // inputName="number"
                                            // placeholder="Number..."
                                            value={formData.number}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    number: e.target.value,
                                                })
                                            }
                                            label="Ware House Number"
                                        />
                                    </div>
                                </div>

                                <div className="col-4 text-start">
                                    <label
                                        htmlFor="employee"
                                        className="form-label"
                                    >
                                        Employee:
                                    </label>
                                    <AsyncSelect
                                        type="text"
                                        id="employee"
                                        // inputName="purchaseOrderNumber"
                                        value={employeeOptions.find(
                                            (option) =>
                                                option.id == formData.employeeId
                                        )}
                                        // value ={formData.employeeOptions.find(option)}
                                        // value={(option) => option.name}
                                        // onChange={(e) => {
                                        //   handleEmployeeSelection(e);
                                        // }}
                                        // isClearable={true}
                                        // defaultOptions={employeeOptions}
                                        // loadOptions={loadEmployeeSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        // getOptionValue={(option) => option.id}
                                    />
                                </div>

                                <div className="col-4 text-start">
                                    <label
                                        htmlFor="issuedBy"
                                        className="form-label"
                                    >
                                        Issued By:
                                    </label>
                                    <AsyncSelect
                                        id="issuedBy"
                                        value={issuedByOptions.find(
                                            (option) =>
                                                option.id ===
                                                    formData.issuedById &&
                                                option.type_person ===
                                                    formData.issuedByType
                                        )}
                                        // onChange={(e) => {
                                        //   handleIssuedBySelection(e);
                                        // }}
                                        // isClearable={true}
                                        // placeholder="Search and select..."
                                        // defaultOptions={issuedByOptions}
                                        // loadOptions={loadIssuedBySelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        // getOptionValue={(option) => option.id}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-4 text-start">
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <p
                                            id="creation-date"
                                            className="text-date"
                                        >
                                            Creation Date and Time
                                        </p>
                                        <DateTimePicker
                                            // label="Creation Date and Time"
                                            className="font-right"
                                            value={dayjs(
                                                formData.createdDateAndTime
                                            )}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    createdDateAndTime:
                                                        dayjs(e).format(
                                                            'YYYY-MM-DD hh:mm A'
                                                        ),
                                                })
                                            }
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="col-4 text-start">
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <p
                                            id="creation-date"
                                            className="text-date"
                                        >
                                            Release Date and Time
                                        </p>
                                        <DateTimePicker
                                            // label="Release Date and Time"
                                            className="font-right"
                                            value={dayjs(formData.release_date)}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    release_date:
                                                        dayjs(e).format(
                                                            'YYYY-MM-DD hh:mm A'
                                                        ),
                                                })
                                            }
                                        />
                                    </LocalizationProvider>
                                </div>

                                <div className="col-4 text-start">
                                    <label
                                        htmlFor="releasedTo"
                                        className="form-label"
                                    >
                                        Released To:
                                    </label>
                                    {!creating ? (
                                        canRender && (
                                            <AsyncSelect
                                                id="consignee"
                                                value={consigneeOptions.find(
                                                    (option) =>
                                                        option.id ===
                                                            formData.consigneeId &&
                                                        option.type_person ===
                                                            formData.consigneeType
                                                )}
                                                onChange={(e) =>
                                                    handleConsigneeSelection(e)
                                                }
                                                isClearable={true}
                                                placeholder="Search and select..."
                                                defaultOptions={
                                                    consigneeOptions
                                                }
                                                loadOptions={
                                                    loadConsigneeToOptionsSelectOptions
                                                }
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                getOptionValue={(option) =>
                                                    option.id
                                                }
                                            />
                                        )
                                    ) : (
                                        <AsyncSelect
                                            id="consignee"
                                            value={consigneeOptions.find(
                                                (option) =>
                                                    option.id ===
                                                        formData.consigneeId &&
                                                    option.type_person ===
                                                        formData.consigneeType
                                            )}
                                            onChange={(e) =>
                                                handleConsigneeSelection(e)
                                            }
                                            isClearable={true}
                                            placeholder="Search and select..."
                                            defaultOptions={consigneeOptions}
                                            loadOptions={
                                                loadConsigneeToOptionsSelectOptions
                                            }
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            getOptionValue={(option) =>
                                                option.id
                                            }
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="clienToDiv text-start">
                                <label
                                    htmlFor="customer"
                                    className="form-label"
                                >
                                    Client to Bill:
                                </label>
                                <AsyncSelect
                                    id="clienTo"
                                    onChange={(e) => {
                                        handleClientToBillSelection(e);
                                    }}
                                    value={customerByOptions.find(
                                        (option) =>
                                            option.id ===
                                                formData.clientToBillId &&
                                            option.type_person ===
                                                formData.clientToBillType
                                    )}
                                    placeholder="Release To . . . "
                                    defaultOptions={customerByOptions}
                                    loadOptions={loadCustomerBySelectOptions}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    isClearable={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>Carrier</h2>
                                <span></span>
                            </div>
                            <div className="row align-items-center mb-3">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="mainCarrier"
                                        className="form-label"
                                    >
                                        Carrier:
                                    </label>
                                    <Input
                                        type="text"
                                        inputName="purchaseOrderNumber"
                                        placeholder="Carrier . . . "
                                        value={
                                            formData.inland_carrierObj.name ||
                                            ''
                                        }
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <Input
                                        type="text"
                                        inputName="trackingNumber"
                                        placeholder="Tracking Number..."
                                        value={formData.tracking_number}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                tracking_number: e.target.value,
                                            })
                                        }
                                        label="Tracking Number"
                                    />
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-6 text-start">
                                    <Input
                                        type="text"
                                        inputName="proNumber"
                                        placeholder="PRO Number..."
                                        value={formData.pro_number}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                pro_number: e.target.value,
                                            })
                                        }
                                        label="PRO Number"
                                    />
                                </div>

                                <div className="col-6 text-start">
                                    <Input
                                        type="text"
                                        inputName="purchaseOrderNumber"
                                        placeholder="Purchase Order Number..."
                                        value={
                                            formData.purchase_order_number || ''
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                purchase_order_number:
                                                    e.target.value,
                                            })
                                        }
                                        label="Purchase Order Number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="creation creation-container">
                    <div className="form-label_name">
                        <h2>Commodities</h2>
                        <span></span>
                    </div>

                    <Table
                        noScroll
                        noScrollY
                        data={commodities}
                        columns={[
                            'ReleaseCheck',
                            'Description',
                            ' Length (in)',
                            ' Width (in)',
                            ' Height (in)',
                            ' Weight (lb)',
                            ' Location',
                            ' Volume (ft3)',
                            ' Volume-Weight (Vlb)',
                            // " Weight (lb)",
                        ]}
                        onAdd={() => {}}
                        showOptions={false}
                        Nodoubleclick={true}
                        CheckForRealease={handleSelectRealeaseeChecked}
                    />
                </div>

                {/* <div className="creation creation-container w-100">
        <div className="row align-items-center">
          <div
            className="col-6 text-start"
            style={{ fontSize: "14px", fontWeight: "bold" }}
          >
            {warehouseReceipts.map((receipt) => (
              <div key={receipt.number}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedReceipts.includes(receipt.number)}
                    onChange={() => handleReceiptSelection(receipt.number)}
                  />
                  {receipt.number} - {receipt.issued_byObj?.name}
                </label>
                {selectedReceipts.includes(receipt.number) &&
                  receipt.commodities.length > 0 && (
                    <select
                      multiple
                      value={selectedCommodities
                        .filter((item) => item.receiptNumber === receipt.number)
                        .map((item) => item.commodities)}
                      onChange={(e) =>
                        handleCommoditySelection(
                          receipt.number,
                          e.target.value,
                          receipt.id
                        )
                      }
                    >
                      {receipt.commodities.map((commodity) => (
                        <option key={commodity.id} value={commodity.id}>
                          {commodity.height}x{commodity.width}x
                          {commodity.length} - {commodity.description}
                        </option>
                      ))}
                    </select>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div> */}

                <div className="creation creation-container">
                    <div className="form-label_name">
                        <h3>Attachments</h3>
                        <span></span>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <label
                                htmlFor="fileInput"
                                className="custom-file-input"
                            >
                                <span
                                    className="button-text"
                                    style={{ padding: '0 0 0 17%' }}
                                >
                                    Select files
                                </span>
                                <input
                                    type="file"
                                    id="fileInput"
                                    multiple
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <br />
                            <br />
                            <div className="attachment-container">
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment.name}
                                        className="attachment-wrapper"
                                    >
                                        <div
                                            onClick={() =>
                                                handlePreview(attachment)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {attachment.type.startsWith(
                                                'image/'
                                            ) ? (
                                                <img
                                                    src={attachment.base64}
                                                    alt={attachment.name}
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={getIcon(
                                                        attachment.type
                                                    )}
                                                    size="10x"
                                                    style={{
                                                        color: getColor(
                                                            attachment.type
                                                        ),
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <span className="attachment-name">
                                            {attachment.name}
                                        </span>
                                        <div className="delete-button-container">
                                            <button
                                                className="custom-button"
                                                onClick={() =>
                                                    handleDeleteAttachment(
                                                        attachment.name
                                                    )
                                                }
                                            >
                                                <div className="delete-icon">
                                                    <p>&times;</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {showPreview && (
                        <div
                            className="preview-overlay"
                            onClick={handleClosePreview}
                        >
                            <div className="preview-container">
                                <button
                                    className="button-cancel pick"
                                    onClick={handleClosePreview}
                                >
                                    <i className="fas fa-times-circle"></i>
                                </button>
                                {renderPreviewContent()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="creation creation-container">
                    <div className="form-label_name">
                        <h3>Notes</h3>
                        <span></span>
                    </div>

                    <div className="row align-items-center">
                        <div
                            className="col-10 text-start"
                            style={{ width: '100%' }}
                        >
                            <Input
                                type="textarea"
                                inputName="notes"
                                placeholder="Note here..."
                                // label="Note"
                                value={formData.notes}
                                changeHandler={(e) =>
                                    setFormData({
                                        ...formData,
                                        notes: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="company-form__options-container">
                    <button
                        className="button-save"
                        onClick={() => setShowModalConfirm(true)}
                    >
                        Save
                    </button>

                    <button className="button-cancel" onClick={closeModal}>
                        Cancel
                    </button>
                </div>
                {showModalConfirm && (
                    <ConfirmModal
                        title="Confirm"
                        onHide={() => setShowModalConfirm(false)}
                        body={'Are you sure you want to save the changes?'}
                        onConfirm={() => {
                            setShowModalConfirm(false);
                            sendData();
                        }}
                        onCancel={() => setShowModalConfirm(false)}
                    />
                )}
                {/* {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Success</AlertTitle>
          <strong>
            Release Order {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )} */}
                {showSuccessAlert && (
                    <Alert
                        severity="success"
                        onClose={() => setShowSuccessAlert(false)}
                        className="alert-notification"
                    >
                        <p className="succes"> Success </p>
                        <p className=" created">
                            {' '}
                            Release Order {creating
                                ? 'created'
                                : 'updated'}{' '}
                            successfully!
                        </p>
                    </Alert>
                )}
                {showErrorAlert && (
                    <Alert
                        severity="error"
                        onClose={() => setShowErrorAlert(false)}
                        className="alert-notification"
                    >
                        <AlertTitle>Error</AlertTitle>
                        <strong>
                            Error {creating ? 'creating' : 'updating'} Release
                            Order. Please try again
                        </strong>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default ReleaseOrderCreationForm;
