import { useState, useEffect } from 'react';
import propTypes from 'prop-types'; // Import propTypes from 'prop-types'
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
import Table from '../shared/components/Table';
import ReceiptService from '../../services/ReceiptService';
import IncomeChargeForm from './IncomeChargeForm';
import CommodityCreationForm from './CommodityCreationForm';
import AsyncSelect from 'react-select/async';
import ExpenseChargeForm from './ExpenseChargeForm';
import EventCreationForm from './EventCreationForm';
import '../../styles/components/ReceipCreationForm.scss';
import RepackingForm from './RepackingForm';
import PickupService from '../../services/PickupService';
import CarrierCreationForm from '../forms/CarrierCreationForm';
import ForwardingAgentsCreationForm from '../forms/ForwardingAgentCreationForm';
import { fetchFormData } from './DataFetcher';
import ModalForm from '../shared/components/ModalForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile,
    faFileWord,
    faFileExcel,
    faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import mammoth from 'mammoth';
import ConfirmModal from '../../views/shared/components/ConfirmModal';
import CustomerCreationForm from './CustomerCreationForm';

const ReceiptCreationForm = ({
    pickupOrder,
    closeModal,
    creating,
    onpickupOrderDataChange,
    currentPickUpNumber,
    setcurrentPickUpNumber,
    fromPickUp,
    fromReceipt,
    showBModal,
}) => {
    console.log('pickupOrder', pickupOrder);
    console.log('creating', creating);
    const [activeTab, setActiveTab] = useState('general');
    // const [note, setNote] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [formDataUpdated, setFormDataUpdated] = useState(false);
    console.log('formdataupdated', formDataUpdated);
    //added warning alert for commodities
    const [showWarningAlert, setShowWarningAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [allStateUpdatesComplete, setAllStateUpdatesComplete] =
        useState(false);
    const [showIncomeForm, setshowIncomeForm] = useState(false);
    const [showExpenseForm, setshowExpenseForm] = useState(false);
    const [showEventForm, setshowEventForm] = useState(false);
    const [consignee, setconsignee] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [defaultValueSupplier, setDefaultValueSupplier] = useState(null);
    const [agent, setagent] = useState(null);
    const [shipper, setshipper] = useState(null);
    const [consigneeRequest, setconsigneeRequest] = useState(null);
    const [shipperRequest, setshipperRequest] = useState(null);
    const [supplierRequest, setsupplierRequest] = useState(null);
    const [clientToBillRequest, setclientToBillRequest] = useState(null);
    const [weightUpdated, setWeightUpdated] = useState(0);
    const [volumenUpdated, setVolumenUpdated] = useState(0);
    const [releasedToOptions, setReleasedToOptions] = useState([]);
    const [CTBType, setCTBType] = useState('');
    const [showCommodityCreationForm, setshowCommodityCreationForm] =
        useState(false);
    const [commodities, setcommodities] = useState([]);
    const [charges, setcharges] = useState([]);
    const [events, setEvents] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [consigneeOptions, setConsigneeOptions] = useState([]);
    const [issuedByOptions, setIssuedByOptions] = useState([]);
    const [destinationAgentOptions, setDestinationAgentOptions] = useState([]);
    const [shipperOptions, setShipperOptions] = useState([]);
    const [carrierOptions, setCarrierOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [defaultValueShipper, setdefaultValueShipper] = useState(null);
    const [defaultValueConsignee, setdefaultValueConsignee] = useState(null);
    const today = dayjs().format('YYYY-MM-DD hh:mm A');
    const pickupNumber = currentPickUpNumber + 1;
    const [canRender, setcanRender] = useState(false);
    // const [supplierInfo, setsupplierInfo] = useState("");

    const [showCommodityEditForm, setshowCommodityEditForm] = useState(false);
    const [showCommodityInspect, setshowCommodityInspect] = useState(false);
    const [showRepackingForm, setshowRepackingForm] = useState(false);
    const [selectedCommodity, setselectedCommodity] = useState(null);
    //-------------------------------------------------------
    const [SelectEvent, setSelectEvent] = useState(null);
    const [changeStateButton, setChangeStateButton] = useState(false);

    const [selectedIncomeCharge, setSelectedIncomeCarge] = useState(null);
    const [selectedExpenseCharge, setSelectedExpenseCarge] = useState(null);
    const [showIncomeChargeEditForm, setshowIncomeChargeEditForm] =
        useState(false);
    const [showExpenseEditForm, setshowExpenseEditForm] = useState(false);
    // Desabilitar el botón si commodities es null o vacío y cambio de estado
    const [changeStateSave, setchangeStateSave] = useState(false);
    const isButtonDisabled = !commodities || commodities.length === 0;
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    //added  carrier modal
    const [isModalOpenCarrier, setIsModalOpenCarrier] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState(null);
    const [isProcessCompleteCarrier, setIsProcessCompleteCarrier] =
        useState(false);
    //added  Destination Agent modal
    const [isModalOpenDestinationAgent, setIsModalOpenDestinationAgent] =
        useState(false);
    const [selectedDestinationAgent, setSelectedDestinationAgent] =
        useState(null);
    const [
        isProcessCompleteDestinationAgent,
        setIsProcessCompleteDestinationAgent,
    ] = useState(false);
    //added  Agent modal
    const [isModalOpenAgent, setIsModalOpenAgent] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isProcessCompleteAgent, setIsProcessCompleteAgent] = useState(false);
    //added Supplier modal
    const [isModalOpenSupplier, setIsModalOpenSupplier] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isProcessCompleteSupplier, setIsProcessCompleteSupplier] =
        useState(false);
    //added  Shipper modal
    const [isModalOpenShipper, setIsModalOpenShipper] = useState(false);
    const [selectedShipp, setSelectedShipper] = useState(null);
    const [isProcessCompleteShipper, setIsProcessCompleteShipper] =
        useState(false);
    //added  Consignee modal
    const [isModalOpenConsignee, setIsModalOpenConsignee] = useState(false);
    const [selectedConsignee, setSelectedConsignee] = useState(null);
    const [isProcessCompleteConsignee, setIsProcessCompleteConsignee] =
        useState(false);

    useEffect(() => {
        fetchFormData()
            .then((data) => {
                const forwardingAgents = data.filter(
                    (item) => item.type === 'forwardingAgent'
                );
                const customers = data.filter(
                    (item) => item.type === 'customer'
                );
                const vendors = data.filter((item) => item.type === 'vendor');
                const employees = data.filter(
                    (item) => item.type === 'employee'
                );
                const carriers = data.filter((item) => item.type === 'Carrier');

                const customersWithType = addTypeToObjects(
                    customers,
                    'customer'
                );
                const forwardingAgentsWithType = addTypeToObjects(
                    forwardingAgents,
                    'forwarding-agent'
                );
                const clientToBillOptions = [
                    ...customersWithType,
                    // ...forwardingAgentsWithType,
                ];

                setIssuedByOptions([...forwardingAgents].sort(SortArray));
                setDestinationAgentOptions(
                    [...forwardingAgents].sort(SortArray)
                );
                setEmployeeOptions([...employees].sort(SortArray));
                setShipperOptions([...customers].sort(SortArray));
                setSupplierOptions([...customers].sort(SortArray));
                setConsigneeOptions([...customers].sort(SortArray));
                setCarrierOptions([...carriers].sort(SortArray));
                setReleasedToOptions(clientToBillOptions.sort(SortArray));
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);

    useEffect(() => {
        if (!isButtonDisabled) {
            setchangeStateSave(false);
        }
    }, [isButtonDisabled]);

    //added variable editing for commodities
    const [editingComodity, setEditingComodity] = useState(false);
    const formFormat = {
        status: '',
        number: pickupNumber,
        createdDateAndTime: today,
        pickupDateAndTime: today,
        deliveryDateAndTime: today,
        issuedById: '',
        issuedByType: '',
        issuedByInfo: '',
        destinationAgentId: '',
        employeeId: '',

        shipperId: '',
        shipperType: '',
        shipperInfo: '',
        pickupLocationId: '',
        pickupLocationType: '',
        pickupLocationInfo: '',

        supplierId: '',
        supplierType: '',
        supplierInfo: '',

        consigneeId: '',
        consigneeType: '',
        consigneeInfo: '',
        deliveryLocationId: '',
        deliveryLocationType: '',
        deliveryLocationInfo: '',

        proNumber: '',
        trackingNumber: '',
        mainCarrierdId: '',
        mainCarrierInfo: '',

        inlandCarrierdId: '',
        inlandCarrierdInfo: '',

        invoiceNumber: '',
        purchaseOrderNumber: '',

        clientToBillId: '',
        clientToBillType: '',

        commodities: [],
        notes: '',
        charges: [],
        events: [],
        pro_number: '',
        tracking_number: '',
        invoice_number: '',
        purchase_order_number: '',
        pickup_order_id: '',
    };
    const [formData, setFormData] = useState(formFormat);
    //added unrepack
    const [repackedItems, setRepackedItems] = useState([]);
    const [selectedRepackId, setSelectedRepackId] = useState(null);

    const handleIssuedBySelection = async (event) => {
        const id = event.id;
        const type = event.type;
        const result = await ForwardingAgentService.getForwardingAgentById(id);
        const info = `${result.data.street_and_number || ''} - ${
            result.data.city || ''
        } - ${result.data.state || ''} - ${result.data.country || ''} - ${
            result.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            issuedById: id,
            issuedByType: type,
            issuedByInfo: info,
        });
        setSelectedAgent(result?.data);
        console.log('setSelectedAgent', setSelectedAgent);
    };

    const handleDestinationAgentSelection = async (event) => {
        const id = event?.id || '';
        const type = event?.type || '';
        const result = await ForwardingAgentService.getForwardingAgentById(id);
        const info = `${result?.data.street_and_number || ''} - ${
            result?.data.city || ''
        } - ${result?.data.state || ''} - ${result?.data.country || ''} - ${
            result?.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            destinationAgentId: id,
            destinationAgentType: type,
            destinationAgentInfo: info,
        });
        setSelectedDestinationAgent(result?.data); // Set the selected Destination Agent
        console.log('setSelectedDestinationAgent', setSelectedDestinationAgent);
    };

    //------------------------------------------------
    const handleSelectEvent = (events) => {
        setSelectEvent(events);
        console.log('selected events ', events);
    };

    const handleDeleteEvent = () => {
        if (SelectEvent) {
        }
    };

    //------------------------------------------------

    const handleSelectIncomeCharge = (commodity) => {
        setSelectedIncomeCarge(commodity);
    };

    const handleSelectExpenseCharge = (commodity) => {
        setSelectedExpenseCarge(commodity);
    };

    const handleIncomeChargeDelete = () => {
        const newCharges = charges.filter(
            (com) => com.id != selectedIncomeCharge.id
        );
        setcharges(newCharges);
    };

    const handleExpenseChargeDelete = () => {
        const newCharges = charges.filter(
            (com) => com.id != selectedExpenseCharge.id
        );
        setcharges(newCharges);
    };

    const handleEmployeeSelection = async (event) => {
        const id = event.id;
        setFormData({
            ...formData,
            employeeId: id,
        });
    };

    const handleClientToBillSelection = async (event) => {
        const type = event?.target?.value || '';

        if (type === 'other') {
            setFormData({ ...formData, clientToBillType: type });
        } else if (type === 'shipper' || type === 'consignee') {
            if (formData.shipperId || formData.consigneeId) {
                const id =
                    type === 'shipper'
                        ? formData.shipperId
                        : formData.consigneeId;
                setFormData({
                    ...formData,
                    clientToBillType: type,
                    clientToBillId: id,
                });
            } else {
                console.error('ShipperId or consigneeId is not available.');
            }
        } else {
            setCTBType(event?.type);
            const id = event?.id;
            const type =
                event?.type === 'shipper'
                    ? 'shipper'
                    : event?.type === 'consignee'
                      ? 'consignee'
                      : 'other';

            setFormData({
                ...formData,
                clientToBillType: type,
                clientToBillId: id,
            });
        }
    };

    const handleConsigneeSelection = (selectedOption) => {
        if (!selectedOption) return;

        const { id, type, street_and_number, city, state, country, zip_code } =
            selectedOption;
        if (type !== 'customer') {
            console.error(`Unsupported Consignee type: ${type}`);
            return;
        }

        const info = `${street_and_number || ''} - ${city || ''} - ${state || ''} - ${country || ''} - ${zip_code || ''}`;

        setdefaultValueConsignee(selectedOption);
        setFormData({
            ...formData,
            consigneeId: id,
            consigneeType: type,
            consigneeInfo: info,
        });
    };

    const handleSupplierSelection = async (event) => {
        const id = event.id;
        const result = await CustomerService.getCustomerById(id);
        const type = event.type || formData.supplierType;
        const info = `${result.data.street_and_number || ''} - ${
            result.data.city || ''
        } - ${result.data.state || ''} - ${result.data.country || ''} - ${
            result.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            supplierId: id,
            supplierType: type,
            supplierInfo: info,
        });
        setSelectedSupplier(result?.data); // Set the selected Supplier
        console.log('setSelectedSupplier', setSelectedSupplier);
    };

    // const handleSupplierSelection = async (event) => {
    //   if (event && event.id) {
    //     const id = event.id || formData.supplierId;
    //     const type = event.type || formData.supplierType;

    //     let result;
    //     if (type === "forwardingAgent") {
    //       result = await ForwardingAgentService.getForwardingAgentById(id);
    //     } else if (type === "customer") {
    //       result = await CustomerService.getCustomerById(id);
    //     } else if (type === "vendor") {
    //       result = await VendorService.getVendorByID(id);
    //     }

    //     const info = result?.data
    //       ? `${result.data.street_and_number || ""} - ${
    //           result.data.city || ""
    //         } - ${result.data.state || ""} - ${result.data.country || ""} - ${
    //           result.data.zip_code || ""
    //         }`
    //       : formData.supplierInfo;
    //     setSupplier(result?.data || supplier);
    //     setFormData({
    //       ...formData,
    //       supplierId: id,
    //       supplierType: type,
    //       supplierInfo: info,
    //     });
    //   } else {
    //     console.error(
    //       "El objeto de selección de supplier es nulo o no tiene una propiedad 'id'"
    //     );
    //   }
    // };

    const handleShipperSelection = (selectedOption) => {
        if (!selectedOption) return;

        const { id, type, street_and_number, city, state, country, zip_code } =
            selectedOption;

        if (type !== 'customer') {
            console.error(`Unsupported shipper type: ${type}`);
            return;
        }

        const info = `${street_and_number || ''} - ${city || ''} - ${state || ''} - ${country || ''} - ${zip_code || ''}`;

        setdefaultValueShipper(selectedOption);
        setFormData((prevData) => ({
            ...prevData,
            shipperId: id,
            shipperType: type,
            shipperInfo: info,
        }));
    };

    //added handle carrier creation
    const handleAddCarrierClick = () => {
        setSelectedCarrier(null);
        setIsModalOpenCarrier(true);
    };
    const handleEditCarrierClick = () => {
        if (formData.inlandCarrierdId) {
            setIsModalOpenCarrier(true);
        } else {
            alert('Please select a carrier to edit.');
        }
    };
    const closeModalCarrier = () => {
        setIsModalOpenCarrier(false);
        setSelectedCarrier(null);
    };
    const handleProcessCompleteCarrier = async (createdCarrierId = null) => {
        setIsProcessCompleteCarrier(true);
        setIsModalOpenCarrier(false);
        console.log('Proceso completado en CarrierCreationForm');

        // Si se creó un nuevo carrire, utilice su ID; de lo contrario, utilice el inlandCarrierdId existente
        const carrierId = createdCarrierId || formData.inlandCarrierdId;

        if (carrierId) {
            await handleInlandCarrierSelection({ id: carrierId });

            // Obtener y actualizar las opciones del carrier
            const updatedOptions = await loadCarrierSelectOptions('');
            setCarrierOptions(updatedOptions);
        }

        // Restablecer el carrier seleccionado después del procesamiento
        // setSelectedCarrier(null);
    };

    //--------------------------------------------------------------
    //added handle DestinationAgent creation
    const handleAddDestinationAgentClick = () => {
        setSelectedDestinationAgent(null);
        setIsModalOpenDestinationAgent(true);
    };
    const handleEditDestinationAgentClick = () => {
        if (formData.destinationAgentId) {
            setIsModalOpenDestinationAgent(true);
        } else {
            alert('Please select a DestinationAgent to edit.');
        }
    };
    const closeModalDestinationAgent = () => {
        setIsModalOpenDestinationAgent(false);
        setSelectedDestinationAgent(null);
    };
    const handleProcessCompleteDestinationAgent = async (
        createdDestinationAgentId = null
    ) => {
        setIsProcessCompleteDestinationAgent(true);
        setIsModalOpenDestinationAgent(false);
        console.log('Proceso completado en DestinationAgent');

        // Si se creó un nuevo carrire, utilice su ID; de lo contrario, utilice el destinationAgentId existente
        const destinationId =
            createdDestinationAgentId || formData.destinationAgentId;

        if (destinationId) {
            await handleDestinationAgentSelection({ id: destinationId });

            // Obtener y actualizar las opciones del DestinationAgent
            const updatedOptions = await loadDestinationAgentsSelectOptions('');
            setDestinationAgentOptions(updatedOptions);
        }

        // Restablecer el DestinationAgent seleccionado después del procesamiento
        // setSelectedDestinationAgent(null);
    };

    //--------------------------------------------------------------
    //added handle Agent creation
    const handleAddAgentClick = () => {
        setSelectedAgent(null);
        setIsModalOpenAgent(true);
    };
    const handleEditAgentClick = () => {
        if (formData.issuedById) {
            setIsModalOpenAgent(true);
        } else {
            alert('Please select a Agent to edit.');
        }
    };
    const closeModalAgent = () => {
        setIsModalOpenAgent(false);
        setSelectedAgent(null);
    };
    const handleProcessCompleteAgent = async (createdAgentId = null) => {
        setIsProcessCompleteAgent(true);
        setIsModalOpenAgent(false);
        console.log('Proceso completado en ForwardingAgentCreationForm');
        // Si se creó un nuevo Agent, utilice su ID; de lo contrario, utilice el issuedById existente
        const AgentId = createdAgentId || formData.issuedById;

        if (AgentId) {
            await handleIssuedBySelection({ id: AgentId });

            // Obtener y actualizar las opciones del Agent
            const updatedOptions = await loadAgentSelectOptions('');
            setIssuedByOptions(updatedOptions);
        }

        // Restablecer el Agent seleccionado después del procesamiento
        // setSelectedAgent(null);
    };
    //------------------------------------------------------------
    //added handle Supplier creation
    const handleAddSupplierClick = () => {
        setSelectedSupplier(null);
        setIsModalOpenSupplier(true);
    };
    const handleEditSupplierClick = () => {
        if (formData.supplierId) {
            setIsModalOpenSupplier(true);
        } else {
            alert('Please select a Supplier to edit.');
        }
    };
    const closeModalSupplier = () => {
        setIsModalOpenSupplier(false);
        setSelectedSupplier(null);
    };
    const handleProcessCompleteSupplier = async (createdSupplierId = null) => {
        setIsProcessCompleteSupplier(true);
        setIsModalOpenSupplier(false);
        console.log('Proceso completado en customerCreationform');

        // Si se creó un nuevo Supplier, utilice su ID; de lo contrario, utilice el inlandCarrierdId existente
        const SupplierId = createdSupplierId || formData.supplierId;

        if (SupplierId) {
            await handleSupplierSelection({ id: SupplierId });

            // Obtener y actualizar las opciones del Supplier
            const updatedOptions = await loadSupplierSelectOptions('');
            setSupplierOptions(updatedOptions);
        }

        // Restablecer el  seleccionado después del procesamiento
        setSelectedSupplier(null);
    };

    //--------------------------------------------------------------
    // //added handle Shipper creation
    const handleAddShipperClick = () => {
        setSelectedShipper(null);
        setIsModalOpenShipper(true);
    };
    const handleEditShipperClick = () => {
        if (formData.shipperId) {
            const shipperToEdit = shipperOptions.find(
                (shipper) => shipper.id === formData.shipperId
            );
            setSelectedShipper(shipperToEdit);
            setIsModalOpenShipper(true);
        } else {
            alert('Please select a Shipper to edit.');
        }
    };
    const closeModalShipper = () => {
        setIsModalOpenShipper(false);
        setSelectedShipper(null);
    };
    // Función para manejar la finalización del proceso de creación/edición
    const handleProcessCompleteShipper = async (createdOrUpdatedShipperId) => {
        setIsProcessCompleteShipper(true);
        setIsModalOpenShipper(false);
        console.log('Process completed in ShipperCreationForm');

        if (createdOrUpdatedShipperId) {
            const updatedShipperOptions = await loadShipperSelectOptions('');
            setShipperOptions(updatedShipperOptions);
            const updatedShipper = updatedShipperOptions.find(
                (shipper) => shipper.id === createdOrUpdatedShipperId
            );

            if (updatedShipper) {
                handleShipperSelection(updatedShipper);
            }
        }
    };
    //Muy importante para despues de add/edit recarcargar opciones de Shipper!!
    useEffect(() => {
        if (isProcessCompleteShipper) {
            loadShipperSelectOptions('').then((options) => {
                // Actualizar las opciones carajo
                setShipperOptions(options);
                setPickupLocationOptions(options);
                setReleasedToOptions(options);
                if (selectedShipp) {
                    const updatedShipper = options.find(
                        (option) => option.id === selectedShipp.id
                    );
                    if (updatedShipper) {
                        handleShipperSelection(updatedShipper);
                    }
                }
                setIsProcessCompleteShipper(false);
            });
        }
    }, [isProcessCompleteShipper, selectedShipp]);

    //--------------------------------------------------------------

    // //added handle consignee creation
    const handleAddConsigneeClick = () => {
        setSelectedConsignee(null);
        setIsModalOpenConsignee(true);
    };
    const handleEditConsigneeClick = () => {
        if (formData.consigneeId) {
            const ConsigneeToEdit = consigneeOptions.find(
                (consignee) => consignee.id === formData.consigneeId
            );
            setSelectedConsignee(ConsigneeToEdit);
            setIsModalOpenConsignee(true);
        } else {
            alert('Please select a consignee to edit.');
        }
    };
    const closeModalConsignee = () => {
        setIsModalOpenConsignee(false);
        setSelectedConsignee(null);
    };
    // Función para manejar la finalización del proceso de creación/edición
    const handleProcessCompleteConsignee = async (
        createdOrUpdatedConsigneeId
    ) => {
        setIsProcessCompleteConsignee(true);
        setIsModalOpenConsignee(false);
        console.log('Process completed in ConsigneeCreationForm');

        if (createdOrUpdatedConsigneeId) {
            const updatedConsigneeOptions =
                await loadConsigneeSelectOptions('');
            setConsigneeOptions(updatedConsigneeOptions);

            const updatedConsignee = updatedConsigneeOptions.find(
                (consignee) => consignee.id === createdOrUpdatedConsigneeId
            );

            if (updatedConsignee) {
                handleConsigneeSelection(updatedConsignee);
            }
        }
    };
    //Muy importante para despues de add/edit recarcargar opciones de Consignee!!
    useEffect(() => {
        if (isProcessCompleteConsignee) {
            loadConsigneeSelectOptions('').then((options) => {
                // Actualizar las opciones carajo
                setConsigneeOptions(options);
                setDeliveryLocationOptions(options);
                setReleasedToOptions(options);
                if (selectedConsignee) {
                    const updatedConsignee = options.find(
                        (option) => option.id === selectedConsignee.id
                    );
                    if (updatedConsignee) {
                        handleConsigneeSelection(updatedConsignee);
                    }
                }
                setIsProcessCompleteConsignee(false);
            });
        }
    }, [isProcessCompleteConsignee, selectedConsignee]);

    //---------------------------------CHARGE IMG---------------------------------------------------------

    const [showPreview, setShowPreview] = useState(false);

    const [fileContent, setfileContent] = useState({});

    // const pdfPlugin = defaultLayoutPlugin();

    const handleDownloadAttachment = (base64Data, fileName) => {
        // Convertir la base64 a un Blob
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: 'image/jpeg' });

        // Crear un enlace temporal y descargar el Blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };
    //---------------------------------------
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

    const handleInlandCarrierSelection = async (event) => {
        const id = event.id;
        const result = await CarrierService.getCarrierById(id);
        const info = `${result.data.street_and_number || ''} - ${
            result.data.city || ''
        } - ${result.data.state || ''} - ${result.data.country || ''} - ${
            result.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            inlandCarrierdId: id,
            inlandCarrierdInfo: info,
        });
        setSelectedCarrier(result?.data); // Set the selected carrier
        console.log('setSelectedCarrier', setSelectedCarrier);
    };

    const handleSelectCommodity = (commodity) => {
        setselectedCommodity(commodity);
        console.log('selected commodity ', commodity);
    };

    const handleCommodityDelete = async () => {
        if (!selectedCommodity) {
            alert('Please select a commodity before deleting it.');
            return;
        }
        //added alert message if editing
        if (editingComodity) {
            alert('Please finish editing the commodity before deleting it.');
            return;
        }
        try {
            // Mostrar un cuadro de diálogo de confirmación
            const confirmDelete = window.confirm(
                `Are you sure you want to delete this commodity "${selectedCommodity.description}" or do "${selectedCommodity.description}" unpacking?`
            );
            // Si el usuario hace clic en "Aceptar" en el cuadro de diálogo
            if (confirmDelete) {
                if (
                    selectedCommodity.internalCommodities &&
                    selectedCommodity.internalCommodities.length > 0
                ) {
                    // Realizar desempaque (unpack)
                    const remainingCommodities = commodities.filter(
                        (commodity) => commodity.id !== selectedCommodity.id
                    );

                    const unpackedCommodities = [
                        ...selectedCommodity.internalCommodities,
                    ];
                    // Actualizar el estado con la información más reciente
                    setcommodities([
                        ...remainingCommodities,
                        ...unpackedCommodities,
                    ]);
                    setSelectedRepackId(null);
                } else {
                    // Elimina el commodity si no contiene commodities internos
                    const newCommodities = commodities.filter(
                        (com) => com.id !== selectedCommodity.id
                    );

                    setcommodities(newCommodities);
                }

                // Esperar selectedCommodity como null
                setTimeout(() => {
                    setselectedCommodity(null);
                }, 100);
            } else {
                return;
            }
        } catch (error) {
            console.error('Error when deleting the commodity:', error);
        }
    };

    //added edit commodities
    const handleCommodityEdit = () => {
        console.log('commodities description ', selectedCommodity.description);
        setEditingComodity(true);
        console.log('commodities description ', selectedCommodity);
    };

    const updateSelectedCommodity = (updatedInternalCommodities) => {
        const updatedCommodity = { ...selectedCommodity };
        updatedCommodity.internalCommodities = updatedInternalCommodities;
        setselectedCommodity(updatedCommodity);

        const index = commodities.findIndex(
            (com) => com.id == selectedCommodity.id
        );

        if (index != -1) {
            const commoditiesCopy = [...commodities];
            commoditiesCopy[index] = updatedCommodity;
            setcommodities(commoditiesCopy);
        }
    };

    useEffect(() => {
        const handleModalClick = (event) => {
            const clickedElement = event.target;
            const isForm = clickedElement.closest('.income-charge-form');

            if (!isForm) {
                setselectedCommodity(null);
                setshowCommodityEditForm(false);
            }
        };

        document
            .querySelector('.pickup')
            ?.addEventListener('click', handleModalClick);

        return () => {
            document
                .querySelector('.pickup')
                ?.removeEventListener('click', handleModalClick);
        };
    }, []);

    // const addNotes = () => {
    //   const updatedNotes = [...formData.notes, note];

    //   setFormData({ ...formData, notes: updatedNotes });
    // };

    const loadShipperOption = async (id, type) => {
        let option = null;
        if (type === 'customer') {
            option = await CustomerService.getCustomerById(id);
        }
        if (type === 'vendor') {
            option = await VendorService.getVendorByID(id);
        }
        if (type === 'forwardingAgent') {
            option = await ForwardingAgentService.getForwardingAgentById(id);
        }
        if (type === 'Carrier') {
            option = await CarrierService.getCarrierById(id);
        }
        setdefaultValueShipper(option.data);
    };

    const loadConsigneeOption = async (id, type) => {
        let option = null;
        if (type === 'customer') {
            option = await CustomerService.getCustomerById(id);
        }
        if (type === 'vendor') {
            option = await VendorService.getVendorByID(id);
        }
        if (type === 'forwardingAgent') {
            option = await ForwardingAgentService.getForwardingAgentById(id);
        }
        if (type === 'Carrier') {
            option = await CarrierService.getCarrierById(id);
        }
        setdefaultValueConsignee(option.data);
    };

    const SortArray = (x, y) => {
        return new Intl.Collator('es').compare(x.name, y.name);
    };

    useEffect(() => {
        if (!creating && pickupOrder != null) {
            setcommodities(pickupOrder.commodities);
            setcharges(pickupOrder.charges);
            setEvents(pickupOrder.events);
            setAttachments(pickupOrder.attachments);

            loadShipperOption(
                pickupOrder.shipperObj?.data?.obj?.id,
                pickupOrder.shipperObj?.data?.obj?.type_person !== 'agent'
                    ? pickupOrder.shipperObj?.data?.obj?.type_person
                    : 'forwardingAgent'
            );
            loadConsigneeOption(
                pickupOrder.consigneeObj?.data?.obj?.id,
                pickupOrder.consigneeObj?.data?.obj?.type_person !== 'agent'
                    ? pickupOrder.consigneeObj?.data?.obj?.type_person
                    : 'forwardingAgent'
            );
            setshowExpenseForm(true);
            setshowIncomeForm(true);
            setconsignee(pickupOrder.consigneeObj?.data?.obj);
            setconsigneeRequest(pickupOrder.consignee);
            setshipper(pickupOrder.shipperObj?.data?.obj);
            setshipperRequest(pickupOrder.shipper);
            setsupplierRequest(pickupOrder.supplier);
            setagent(pickupOrder.destination_agentObj);
            setshowCommodityCreationForm(true);
            let temp = pickupOrder.clientBillObj?.data?.obj?.data?.obj
                ?.type_person
                ? pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id ===
                  pickupOrder.shipperObj?.data?.obj?.id
                    ? 'shipper'
                    : pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id ===
                        pickupOrder.consigneeObj?.data?.obj?.id
                      ? 'consignee'
                      : 'other'
                : 'other';

            setCTBType(temp !== 'agent' ? temp : 'forwarding-agent');

            let CTBID = '';
            if (fromReceipt) {
                CTBID = pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
                    ? pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
                    : pickupOrder.clientBillObj?.data?.obj?.id;
            } else {
                CTBID = pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
                    ? pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
                    : pickupOrder.clientBillObj?.data?.obj?.id;
            }
            let updatedFormData = {
                status: pickupOrder.status,
                number: pickupOrder.number,
                createdDateAndTime: pickupOrder.creation_date,
                // creation_date_text : formattedDateTime,
                pickupDateAndTime: pickupOrder.pick_up_date,
                deliveryDateAndTime: pickupOrder.delivery_date,
                issuedById: pickupOrder.issued_by,
                issuedByType: pickupOrder.issued_by?.type,
                issuedByInfo: `${pickupOrder.issued_by?.street_and_number || ''} - ${
                    pickupOrder.issuedBy?.city || ''
                } - ${pickupOrder.issuedBy?.state || ''} - ${
                    pickupOrder.issuedBy?.country || ''
                } - ${pickupOrder.issued_by?.zip_code || ''}`,
                destinationAgentId: pickupOrder.destination_agent,
                employeeId: pickupOrder.employee,

                shipper: pickupOrder.shipper,
                shipperId: pickupOrder.shipperObj.data?.obj?.id, //pickupOrder.shipper
                shipperType: pickupOrder.shipperObj.data?.obj?.type_person,
                shipperInfo: `${
                    pickupOrder.shipperObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.city || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.state || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.country || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.zip_code || ''
                }`,
                pickupLocationId: pickupOrder.pick_up_location,
                pickupLocationInfo: `${
                    pickupOrder.pick_up_location?.data?.obj
                        ?.street_and_number || ''
                } - ${pickupOrder.pick_up_location?.data?.obj?.city || ''} - ${
                    pickupOrder.pick_up_location?.data?.obj?.state || ''
                } - ${pickupOrder.pick_up_location?.data?.obj?.country || ''} - ${
                    pickupOrder.pick_up_location?.data?.obj?.zip_code || ''
                }`,

                consignee: pickupOrder.consignee,
                consigneeId: pickupOrder.consigneeObj.data?.obj?.id, //pickupOrder.consignee
                consigneeType: pickupOrder.consigneeObj.data?.obj?.type_person,
                consigneeInfo: `${
                    pickupOrder.consigneeObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.consigneeObj?.data?.obj?.city || ''} - ${
                    pickupOrder.consigneeObj?.data?.obj?.state || ''
                } - ${pickupOrder.consigneeObj?.data?.obj?.country || ''} - ${
                    pickupOrder.consigneeObj?.data?.obj?.zip_code || ''
                }`,
                deliveryLocationId: pickupOrder.delivery_location,
                deliveryLocationInfo: `${
                    pickupOrder.deliveryLocationObj?.data?.obj
                        ?.street_and_number || ''
                } - ${pickupOrder.deliveryLocationObj?.data?.obj?.city || ''} - ${
                    pickupOrder.deliveryLocationObj?.data?.obj?.state || ''
                } - ${pickupOrder.deliveryLocationObj?.data?.obj?.country || ''} - ${
                    pickupOrder.deliveryLocationObj?.data?.obj?.zip_code || ''
                }`,

                proNumber: pickupOrder.pro_number,
                trackingNumber: pickupOrder.tracking_number,
                inlandCarrierdId: pickupOrder.inland_carrier,
                inlandCarrierdInfo: `${
                    pickupOrder.inland_carrierObj?.street_and_number || ''
                } - ${pickupOrder.inland_carrierObj?.city || ''} - ${
                    pickupOrder.inland_carrierObj?.state || ''
                } - ${pickupOrder.inland_carrierObj?.country || ''} - ${
                    pickupOrder.inland_carrierObj?.zip_code || ''
                }`,

                /* supplier: initialSupplier,
                supplierId: initialSupplier?.id,
                supplierType: initialSupplier?.type_person,

                supplierInfo: `${initialSupplier?.street_and_number || ""} - ${
                  initialSupplier?.city || ""
                } - ${initialSupplier?.state || ""} - ${
                  initialSupplier?.country || ""
                } - ${initialSupplier?.zip_code || ""}`, */
                supplier: pickupOrder.supplier,
                supplierId: pickupOrder.supplierObj.data?.obj?.id,
                supplierType: pickupOrder.supplierObj.data?.obj?.type_person,
                supplierInfo: `${
                    pickupOrder.supplierObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.supplierObj?.data?.obj?.city || ''} - ${
                    pickupOrder.supplierObj?.data?.obj?.state || ''
                } - ${pickupOrder.supplierObj?.data?.obj?.country || ''} - ${
                    pickupOrder.supplierObj?.data?.obj?.zip_code || ''
                }`,

                invoiceNumber: pickupOrder.invoice_number,
                purchaseOrderNumber: pickupOrder.purchase_order_number,

                clientToBillId: CTBID,
                clientToBillType: temp,

                commodities: pickupOrder.commodities,
                charges: pickupOrder.charges,
                notes: pickupOrder.notes,
                pickup_order_Id: pickupOrder.id,
            };

            console.log('updatedFormData', updatedFormData);
            const initialSupplier = pickupOrder.shipperObj?.data?.obj;
            handleClientToBillSelection({
                id: CTBID,
                type: temp,
            });
            setFormData(updatedFormData);
            setcanRender(true);
        }
    }, [creating, pickupOrder]);

    const addTypeToObjects = (arr, type) =>
        arr.map((obj) => ({ ...obj, type }));

    const loadIssuedBySelectOptions = async (inputValue) => {
        const responseCustomers = (await CustomerService.search(inputValue))
            .data.results;
        const responseVendors = (await VendorService.search(inputValue)).data
            .results;
        const responseAgents = (await ForwardingAgentService.search(inputValue))
            .data.results;

        const options = [
            ...addTypeToObjects(responseVendors, 'vendor'),
            ...addTypeToObjects(responseCustomers, 'customer'),
            ...addTypeToObjects(responseAgents, 'forwardingAgent'),
        ];

        return options.sort(SortArray);
    };

    const loadDestinationAgentsSelectOptions = async (inputValue) => {
        const responseAgents = (await ForwardingAgentService.search(inputValue))
            .data.results;

        const options = [
            ...addTypeToObjects(responseAgents, 'forwardingAgent'),
        ];

        return options.sort(SortArray);
    };

    const loadEmployeeSelectOptions = async (inputValue) => {
        const response = await EmployeeService.search(inputValue);
        const data = response.data.results;

        const options = addTypeToObjects(data, 'employee');

        return options.sort(SortArray);
    };

    //added para recargar carriersoptions al crear un carrier
    useEffect(() => {
        const initializeCarrierOptions = async () => {
            const initialOptions = await loadCarrierSelectOptions('');
            setCarrierOptions(initialOptions);
        };

        initializeCarrierOptions();
    }, []);
    const loadCarrierSelectOptions = async (inputValue) => {
        const responseCarriers = (await CarrierService.search(inputValue)).data
            .results;
        return addTypeToObjects(responseCarriers, 'Carrier').sort(SortArray);
    };

    //added para recargar destinationAgentOptions al crear un Agent
    useEffect(() => {
        const initializeDestinationAgent = async () => {
            const initialOptions =
                await loadinitializeDestinationAgentSelectOptions('');
            setCarrierOptions(initialOptions);
        };

        initializeDestinationAgent();
    }, []);

    const loadinitializeDestinationAgentSelectOptions = async (inputValue) => {
        const responseDestinationAgent = (
            await CustomerService.search(inputValue)
        ).data.results;
        return addTypeToObjects(responseDestinationAgent, 'forwardingAgent');
    };

    //added para recargar Agentsoptions al crear un Agent
    useEffect(() => {
        const initializeAgentOptions = async () => {
            const initialOptionsAgent = await loadAgentSelectOptions('');
            setIssuedByOptions(initialOptionsAgent);
        };

        initializeAgentOptions();
    }, []);

    const loadAgentSelectOptions = async (inputValueAgent) => {
        const responseAgents = (
            await ForwardingAgentService.search(inputValueAgent)
        ).data.results;
        return addTypeToObjects(responseAgents, 'forwardingAgent');
    };
    //-----------------
    //added para recargar Supplieroptions al crear un Supplier
    useEffect(() => {
        const initializeSupplierOptions = async () => {
            const initialOptions = await loadSupplierSelectOptions('');
            setSupplierOptions(initialOptions);
        };

        initializeSupplierOptions();
    }, []);
    const loadSupplierSelectOptions = async (inputValue) => {
        const responseSupplier = (await CustomerService.search(inputValue)).data
            .results;
        return addTypeToObjects(responseSupplier, 'customer').sort(SortArray);
    };
    //added para recargar Shipperoptions al crear un shipper
    // Efecto para cargar las opciones iniciales de shipper
    useEffect(() => {
        loadShipperSelectOptions('').then((options) =>
            setShipperOptions(options)
        );
    }, []);

    // Función para cargar las opciones de shipper
    const loadShipperSelectOptions = async (inputValue) => {
        const responseCustomers = (await CustomerService.getCustomers()).data
            .results;
        return responseCustomers
            .map((customer) => ({
                ...customer,
                type: 'customer',
                value: customer.id,
                label: customer.name,
            }))
            .sort(SortArray);
    };
    //------------------
    //added para recargar Consigneeoptions al crear un Consignee
    // Efecto para cargar las opciones iniciales de Consignee
    useEffect(() => {
        loadConsigneeSelectOptions('').then((options) =>
            setConsigneeOptions(options)
        );
    }, []);

    // Función para cargar las opciones de Consignee
    const loadConsigneeSelectOptions = async (inputValue) => {
        const responseCustomers = (await CustomerService.getCustomers()).data
            .results;

        return responseCustomers
            .map((customer) => ({
                ...customer,
                type: 'customer',
                value: customer.id,
                label: customer.name,
            }))
            .sort(SortArray);
    };
    //--------------------------------

    useEffect(() => {
        if (!fromPickUp) {
            fetchFormData();
        }
    }, []);

    useEffect(() => {
        if (creating) {
            setFormData({ ...formData, number: pickupNumber });
        }
    }, [pickupNumber]);

    useEffect(() => {
        if (fromPickUp) {
            setshowCommodityCreationForm(true);
            setEmployeeOptions([pickupOrder.employeeObj]);
            setIssuedByOptions([pickupOrder.issued_byObj]);
            setDestinationAgentOptions([pickupOrder.destination_agentObj]);
            setShipperOptions([pickupOrder.shipperObj?.data?.obj]);
            setConsigneeOptions([pickupOrder.consigneeObj?.data?.obj]);
            setCarrierOptions([pickupOrder.inland_carrierObj]);
            setcommodities(pickupOrder.commodities);

            let CTBID = '';
            if (fromReceipt) {
                CTBID = pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
                    ? pickupOrder.clientBillObj?.data?.obj?.data?.obj?.id
                    : pickupOrder.clientBillObj?.data?.obj?.id;
            } else {
                CTBID = pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
                    ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
                    : pickupOrder.client_to_billObj?.data?.obj?.id;
            }
            const initialSupplier = pickupOrder.shipperObj?.data?.obj;
            let updatedFormData = {
                status: 4,
                // notes :pickupOrder.notes,
                weight: pickupOrder.weight,
                volumen: pickupOrder.volumen,
                number: pickupOrder.number,
                createdDateAndTime: pickupOrder.creation_date,
                // creation_date_text : formattedDateTime,
                pickupDateAndTime: pickupOrder.pick_up_date,
                deliveryDateAndTime: pickupOrder.delivery_date,
                issuedById: pickupOrder.issued_by,
                issuedByType: pickupOrder.issued_by?.type,
                issuedByInfo: `${pickupOrder.issued_by?.street_and_number || ''} - ${
                    pickupOrder.issuedBy?.city || ''
                } - ${pickupOrder.issuedBy?.state || ''} - ${
                    pickupOrder.issuedBy?.country || ''
                } - ${pickupOrder.issued_by?.zip_code || ''}`,
                destinationAgentId: pickupOrder.destination_agent,
                employeeId: pickupOrder.employee,

                shipperId: pickupOrder.shipperObj.data?.obj?.id,
                shipperType: pickupOrder.shipperObj.data?.obj?.type_person,
                shipper: pickupOrder.shipper,
                shipperObjId: pickupOrder.shipperObj.data?.obj?.id,
                shipperInfo: `${
                    pickupOrder.shipperObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.city || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.state || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.country || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.zip_code || ''
                }`,
                pickupLocationId: pickupOrder.pick_up_location,

                pickupLocationInfo: `${
                    pickupOrder.pick_up_location?.data?.obj
                        ?.street_and_number || ''
                } - ${pickupOrder.pick_up_location?.data?.obj?.city || ''} - ${
                    pickupOrder.pick_up_location?.data?.obj?.state || ''
                } - ${pickupOrder.pick_up_location?.data?.obj?.country || ''} - ${
                    pickupOrder.pick_up_location?.data?.obj?.zip_code || ''
                }`,

                consigneeId: pickupOrder.consigneeObj.data?.obj?.id,
                consignee: pickupOrder.consignee,
                consigneeType: pickupOrder.consigneeObj.data?.obj?.type_person,
                consigneeObjId: pickupOrder.consigneeObj.data?.obj?.id,
                consigneeInfo: `${
                    pickupOrder.consigneeObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.consigneeObj?.data?.obj?.city || ''} - ${
                    pickupOrder.consigneeObj?.data?.obj?.state || ''
                } - ${pickupOrder.consigneeObj?.data?.obj?.country || ''} - ${
                    pickupOrder.consigneeObj?.data?.obj?.zip_code || ''
                }`,
                deliveryLocationId: pickupOrder.delivery_location,
                deliveryLocationInfo: `${
                    pickupOrder.deliveryLocationObj?.data?.obj
                        ?.street_and_number || ''
                } - ${pickupOrder.deliveryLocationObj?.data?.obj?.city || ''} - ${
                    pickupOrder.deliveryLocationObj?.data?.obj?.state || ''
                } - ${pickupOrder.deliveryLocationObj?.data?.obj?.country || ''} - ${
                    pickupOrder.deliveryLocationObj?.data?.obj?.zip_code || ''
                }`,

                proNumber: pickupOrder.pro_number,
                trackingNumber: pickupOrder.tracking_number,
                inlandCarrierdId: pickupOrder.inland_carrier,
                inlandCarrierdInfo: `${
                    pickupOrder.inland_carrierObj?.street_and_number || ''
                } - ${pickupOrder.inland_carrierObj?.city || ''} - ${
                    pickupOrder.inland_carrierObj?.state || ''
                } - ${pickupOrder.inland_carrierObj?.country || ''} - ${
                    pickupOrder.inland_carrierObj?.zip_code || ''
                }`,

                supplierId: pickupOrder.shipperObj.data?.obj?.id,
                supplierType: pickupOrder.shipperObj.data?.obj?.type_person,
                supplier: pickupOrder.shipper,
                supplierObjId: pickupOrder.shipperObj.data?.obj?.id,
                supplierInfo: `${
                    pickupOrder.shipperObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.city || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.state || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.country || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.zip_code || ''
                }`,

                invoiceNumber: pickupOrder.invoice_number,
                purchaseOrderNumber: pickupOrder.purchase_order_number,

                clientToBillId: CTBID,
                clientToBillType:
                    CTBID === pickupOrder.consigneeObj.data?.obj?.id
                        ? 'consignee'
                        : CTBID === pickupOrder.shipperObj.data?.obj?.id
                          ? 'shipper'
                          : '',

                commodities: pickupOrder.commodities,
                pickup_order_Id: pickupOrder.id,
                // notes: [],
            };
            setFormData(updatedFormData);
            setFormDataUpdated(true);
            setconsigneeRequest(pickupOrder.consignee);
            setshipperRequest(pickupOrder.shipper);
            setsupplierRequest(pickupOrder.supplier);
        }
    }, [fromPickUp, pickupOrder]);

    useEffect(() => {
        if (formDataUpdated) {
            handleConsigneeSelection({
                id: pickupOrder.consigneeObj?.data?.obj?.id,
                type: pickupOrder.consigneeObj?.data?.obj?.type_person,
            });
            handleShipperSelection({
                id: pickupOrder.shipperObj?.data?.obj?.id,
                type: pickupOrder.shipperObj?.data?.obj?.type_person,
            });
            handleDestinationAgentSelection({
                id: pickupOrder.destination_agentObj?.id,
            });
        }
    }, [formDataUpdated, pickupOrder]);

    const sendData = async () => {
        // Mostrar la alerta si commodities es null o vacío
        if (isButtonDisabled) {
            setchangeStateSave(true);
            //added change estate for warning alert
            setShowWarningAlert(true);
            return;
        }

        if (commodities.length > 0) {
            let totalWeight = 0;
            commodities.forEach((com) => {
                totalWeight += parseFloat(com.weight);
            });
            setWeightUpdated(totalWeight);
        }

        if (commodities.length > 0) {
            let totalVolume = 0;
            commodities.forEach((com) => {
                totalVolume += parseFloat(com.volumen);
            });
            setVolumenUpdated(totalVolume.toFixed(2));
        }
        let auxVar;
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
                formData.clientToBillType === 'consignee'
                    ? (auxVar = response.data.id)
                    : '';
                setconsigneeRequest(response.data.id);
            }
        }

        let shipperName = '';
        if (formData.shipperType === 'customer') {
            shipperName = 'customerid';
        }
        if (formData.shipperType === 'vendor') {
            shipperName = 'vendorid';
        }
        if (formData.shipperType === 'forwardingAgent') {
            shipperName = 'agentid';
        }
        if (formData.shipperType === 'Carrier') {
            shipperName = 'carrierid';
        }
        if (shipperName !== '') {
            const consignee = {
                [shipperName]: formData.shipperId,
            };

            const response = await ReceiptService.createShipper(consignee);
            if (response.status === 201) {
                formData.clientToBillType === 'shipper'
                    ? (auxVar = response.data.id)
                    : '';
                setshipperRequest(response.data.id);
            }
        }
        let supplierName = '';
        if (formData.supplierType === 'customer') {
            supplierName = 'customerid';
        }
        if (formData.supplierType === 'vendor') {
            supplierName = 'vendorid';
        }
        if (formData.supplierType === 'forwardingAgent') {
            supplierName = 'agentid';
        }
        if (formData.supplierType === 'Carrier') {
            supplierName = 'carrierid';
        }
        if (supplierName !== '') {
            const consignee = {
                [supplierName]: formData.supplierId,
            };

            const response = await ReceiptService.createSupplier(consignee);
            if (response.status === 201) {
                setsupplierRequest(response.data.id);
            }
        }

        console.log(
            'CLIENT TO BILL: ',
            formData.clientToBillId,
            formData.clientToBillType
        );
        let clientToBillName = '';
        if (formData.clientToBillType === 'other') {
            if (CTBType === 'customer') {
                clientToBillName = 'customerid';
            }
            if (CTBType === 'vendor') {
                clientToBillName = 'vendorid';
            }
            if (CTBType === 'forwarding-agent') {
                clientToBillName = 'agentid';
            }
            if (CTBType === 'carrier') {
                clientToBillName = 'carrierid';
            }
        }
        if (formData.clientToBillType === 'shipper') {
            clientToBillName = 'shipperid';
        }
        if (formData.clientToBillType === 'consignee') {
            clientToBillName = 'consigneeid';
        }
        if (clientToBillName !== '') {
            const clientToBill = {
                [clientToBillName]:
                    formData.clientToBillType === 'shipper' ||
                    formData.clientToBillType === 'consignee'
                        ? auxVar
                        : formData.clientToBillId,
            };

            const response =
                await ReceiptService.createClientToBill(clientToBill);
            if (response.status === 201) {
                setclientToBillRequest(response.data.id);
            }
        }

        if (commodities.length > 0) {
            let weight = 0;
            commodities.forEach((com) => {
                weight += com.weight;
            });
            setFormData({ ...formData, weight: weight });
        }
    };

    const checkUpdatesComplete = () => {
        if (
            shipperRequest !== null &&
            supplierRequest !== null &&
            consigneeRequest !== null &&
            clientToBillRequest !== null &&
            weightUpdated &&
            volumenUpdated
        ) {
            setAllStateUpdatesComplete(true);
        }

        if (fromPickUp && clientToBillRequest !== null) {
            setAllStateUpdatesComplete(true);
        }
    };

    useEffect(() => {
        checkUpdatesComplete();
        if (allStateUpdatesComplete) {
            const createPickUp = async () => {
                const status =
                    formData.shipperInfo === ' -  -  -  - ' ||
                    formData.consigneeInfo === ' -  -  -  - '
                        ? 2
                        : 4;

                // Convertir createdDateAndTime a ISO 8601
                const isoDate = dayjs(
                    formData.createdDateAndTime,
                    'YYYY-MM-DD hh:mm A'
                ).toISOString();
                // # Obtener la fecha y la hora por separado
                let dataCreation = new Date(isoDate);
                let year = dataCreation.getFullYear();
                let month = String(dataCreation.getMonth() + 1).padStart(
                    2,
                    '0'
                ); // Meses comienzan desde 0
                let day = String(dataCreation.getDate()).padStart(2, '0');
                let hours = dataCreation.getHours();
                let minutes = String(dataCreation.getMinutes()).padStart(
                    2,
                    '0'
                );
                // Determinar AM o PM
                let ampm = hours >= 12 ? 'P' : 'A';
                // Convertir horas de 24 horas a 12 horas
                hours = hours % 12;
                hours = hours ? hours : 12; // La hora 0 debería ser 12
                // Formato: YYYY-MM-DD HH:MM AM/PM
                let formattedDateTime = `${day}/${month}/${year}-${hours}:${minutes}${ampm}`;
                //-----------------------

                let rawData = {
                    status,
                    number: formData.number,
                    creation_date: isoDate,
                    creation_date_text: formattedDateTime,
                    issued_by: formData.issuedById,
                    destination_agent: formData.destinationAgentId,
                    employee: formData.employeeId,
                    supplier: supplierRequest,
                    /* supplier: shipperRequest, */
                    shipper: shipperRequest,
                    consignee: consigneeRequest,
                    client_to_bill: clientToBillRequest,
                    main_carrier: formData.mainCarrierdId,
                    inland_carrier: formData.inlandCarrierdId,
                    commodities: commodities,
                    charges: charges,
                    events: events,
                    attachments: attachments.map((attachment) => {
                        return {
                            name: attachment.name,
                            type: attachment.type,
                            base64: attachment.base64,
                        };
                    }),
                    notes: formData.notes,
                    pro_number: formData.proNumber,
                    tracking_number: formData.trackingNumber,
                    invoice_number: formData.invoiceNumber,
                    purchase_order_number: formData.purchaseOrderNumber,
                    weight: weightUpdated,
                    volumen: volumenUpdated,
                    pickup_order_id: formData.pickup_order_Id,
                };
                //added para guardar comidities in pickup order
                let rawDatapick = {
                    status: formData.status,
                    number: formData.number,
                    creation_date: formData.createdDateAndTime,
                    creation_date_text: formattedDateTime,
                    pick_up_date: formData.pickupDateAndTime,
                    delivery_date: formData.deliveryDateAndTime,
                    issued_by: formData.issuedById,
                    destination_agent: formData.destinationAgentId,
                    employee: formData.employeeId,

                    shipper: shipperRequest,
                    shipperType: '',
                    pick_up_location: formData.pickuplocation,

                    consignee: consigneeRequest,
                    delivery_location: formData.deliverylocation,
                    client_to_bill_type: formData.client_to_bill_type,
                    clientToBillType: formData.client_to_bill_type,
                    client_to_bill: formData.client_to_bill,

                    pro_number: formData.proNumber,
                    tracking_number: formData.trackingNumber,
                    inland_carrier: formData.inlandCarrierdId,
                    main_carrier: formData.mainCarrierdId,

                    invoice_number: formData.invoiceNumber,
                    purchase_order_number: formData.purchaseOrderNumber,

                    commodities: commodities,
                    charges: charges,
                    /*  supplier: formData.shipperId, */
                    weight: weightUpdated,
                    volumen: volumenUpdated,
                    pickup_order_id: formData.pickup_order_Id,
                };

                const response = await (creating
                    ? (async () => {
                          const result =
                              await ReceiptService.createReceipt(rawData);
                          if (result) {
                              if (
                                  pickupOrder &&
                                  pickupOrder.id &&
                                  pickupOrder.id !== ''
                              ) {
                                  await PickupService.updatePickup(
                                      pickupOrder.id,
                                      rawDatapick
                                  );
                              }
                          }
                          return result;
                      })()
                    : (async () => {
                          const result = await ReceiptService.updateReceipt(
                              pickupOrder.id,
                              rawData
                          );
                          const buscarrecipt =
                              await ReceiptService.getReceiptById(
                                  pickupOrder.id
                              );
                          const buscarpickup = (await callPickupOrders(null))
                              .data.results;
                          const numeroRecibo = buscarrecipt.data.number;

                          buscarpickup.forEach((pickup) => {
                              if (pickup.number === numeroRecibo) {
                                  PickupService.updatePickup(
                                      pickup.id,
                                      rawDatapick
                                  );
                              }
                          });

                          return result; // Retornar el resultado de updateReceipt
                      })());

                /* if (!creating) {
                    const buscarrecipt = await ReceiptService.getReceiptById(pickupOrder.id);
                    const buscarpickup = (await callPickupOrders(null)).data.results;

                    //console.log("BUSCARPICKUP", buscarpickup);
                    const numeroRecibo = buscarrecipt.data.number;
                    //console.log("numeroRecibo",numeroRecibo);
                    buscarpickup.forEach(pickup => {
                      if (pickup.number === numeroRecibo) {
                        //console.log("HECHO",pickup.number);
                        PickupService.updatePickup(pickup.id, rawDatapick);
                      }
                    });
                  }  */

                if (response.status >= 200 && response.status <= 300) {
                    //PickupService.updatePickup(pickupOrder.id, rawDatapick);

                    //PickupService.updatePickup(pickupOrder.id, rawDatapick);
                    /* if (fromPickUp) {
                      console.log("BANDERA-1 = ", fromPickUp);
                      //added onhand status
                      const statusOnhand = 4;
                      const newPickup = { ...pickupOrder, status: statusOnhand };
                      PickupService.updatePickup(pickupOrder.id, newPickup);
                    } */

                    if (!fromPickUp) {
                        //added onhand status
                        console.log('BANDERA-2 = ', fromPickUp);
                    }
                    setcurrentPickUpNumber(currentPickUpNumber + 1);
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        setChangeStateButton(false);
                        closeModal();
                        onpickupOrderDataChange();
                        setShowSuccessAlert(false);
                        setFormData(formFormat);
                        //added redirect to warehouse receipt
                        window.location.href = `/warehouse/receipt`;
                    }, 1000);
                } else {
                    setShowErrorAlert(true);
                }
            };
            createPickUp();
        }
    }, [
        shipperRequest,
        supplierRequest,
        consigneeRequest,
        allStateUpdatesComplete,
        clientToBillRequest,
    ]);

    const callPickupOrders = async (url = null) => {
        try {
            return await PickupService.getPickups(url);
        } catch (error) {
            console.error('Error al obtener pedidos de recogida:', error);
            throw error;
        }
    };

    /* useEffect(() => {
      console.log(formData)
    }, [formData]) */

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

    const handleCancel = () => {
        window.location.reload();
    };

    const getAsyncSelectValue = () => {
        let selectedOption = null;
        if (formData.clientToBillType === 'shipper') {
            selectedOption = releasedToOptions.find(
                (option) =>
                    option.id === formData.shipperId &&
                    option.type === formData.shipperType
            );
        } else if (formData.clientToBillType === 'consignee') {
            selectedOption = releasedToOptions.find(
                (option) =>
                    option.id === formData.consigneeId &&
                    option.type === formData.consigneeType
            );
        } else {
            selectedOption = releasedToOptions.find(
                (option) =>
                    option.id === formData.client_to_bill &&
                    option.type === CTBType
            );
        }
        return selectedOption;
    };

    //---------------------------------------------------------------------
    // const renderPreview = (attachment) => {
    //   const { name, base64, type } = attachment;

    //   if (type.startsWith("image/")) {
    //     return (
    //       <img
    //         src={base64}
    //         alt={name}
    //         onClick={() => handleShowLargeImage(base64)}
    //         style={{ width: "100px", height: "100px", objectFit: "cover" }}
    //       />
    //     );
    //   } else if (type === 'application/pdf') {
    //     return (
    //       <embed
    //         src={base64}
    //         type="application/pdf"
    //         width="100px"
    //         height="100px"
    //         onClick={() => handleShowLargeImage(base64)}
    //       />
    //     );
    //   } else if (['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(type)) {
    //     return (
    //       <FontAwesomeIcon icon={faFileWord} size="10x" style={{ color: "#1976d2" }} />
    //     );
    //   } else if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(type)) {
    //     return (
    //       <FontAwesomeIcon icon={faFileExcel} size="10x" style={{ color: "#43a047" }} />
    //     );
    //   } else {
    //     return (
    //       <FontAwesomeIcon icon={faFile} size="10x" style={{ color: "#9e9e9e" }} />
    //     );
    //   }
    // };

    return (
        <div className="form-container">
            <div className="company-form receipt">
                <div className="row w-100">
                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h3>General</h3>
                                <span></span>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <Input
                                        type="number"
                                        inputName="number"
                                        placeholder="Number..."
                                        value={formData.number}
                                        readonly={true}
                                        label="Number"
                                    />
                                </div>

                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="employee"
                                        className="form-label"
                                    >
                                        Employee:
                                    </label>
                                    <AsyncSelect
                                        id="employee"
                                        value={employeeOptions.find(
                                            (option) =>
                                                option.id ===
                                                formData.employeeId
                                        )}
                                        onChange={(e) => {
                                            handleEmployeeSelection(e);
                                        }}
                                        isClearable={true}
                                        defaultOptions={employeeOptions}
                                        loadOptions={loadEmployeeSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        placeholder="Search and select..."
                                    />
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="destinationAgent"
                                        className="form-label"
                                    >
                                        Destination Agent:
                                    </label>
                                    {!creating ? (
                                        canRender && (
                                            <AsyncSelect
                                                id="destinationAgent"
                                                onChange={(e) => {
                                                    handleDestinationAgentSelection(
                                                        e
                                                    );
                                                }}
                                                value={destinationAgentOptions.find(
                                                    (option) =>
                                                        option.id ===
                                                        formData.destinationAgentId
                                                )}
                                                isClearable={true}
                                                defaultOptions={
                                                    destinationAgentOptions
                                                }
                                                loadOptions={
                                                    loadDestinationAgentsSelectOptions
                                                }
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                getOptionValue={(option) =>
                                                    option.id
                                                }
                                                key={
                                                    destinationAgentOptions.length
                                                } // Add esto para que se refresque la lista
                                            />
                                        )
                                    ) : (
                                        <AsyncSelect
                                            id="destinationAgent"
                                            onChange={(e) => {
                                                handleDestinationAgentSelection(
                                                    e
                                                );
                                            }}
                                            value={destinationAgentOptions.find(
                                                (option) =>
                                                    option.id ===
                                                    formData.destinationAgentId
                                            )}
                                            isClearable={true}
                                            defaultOptions={
                                                destinationAgentOptions
                                            }
                                            loadOptions={
                                                loadDestinationAgentsSelectOptions
                                            }
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            getOptionValue={(option) =>
                                                option.id
                                            }
                                            placeholder="Search and select..."
                                        />
                                    )}
                                </div>

                                <div className="col-6 text-start">
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <p
                                            id="creation-date"
                                            className="text-date"
                                        >
                                            Entry Date and Time
                                        </p>
                                        <DateTimePicker
                                            // label="Entry Date and Time"
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
                                {/* Forms creacion y edicion DestinationAgent */}
                                <div>
                                    {isModalOpenDestinationAgent &&
                                        selectedDestinationAgent === null && (
                                            <ModalForm
                                                isOpen={
                                                    isModalOpenDestinationAgent
                                                }
                                                onClose={
                                                    closeModalDestinationAgent
                                                }
                                            >
                                                <ForwardingAgentsCreationForm
                                                    forwardingAgent={null}
                                                    closeModal={
                                                        closeModalDestinationAgent
                                                    }
                                                    creating={true}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={(
                                                        createdDestinationAgentId
                                                    ) =>
                                                        handleProcessCompleteDestinationAgent(
                                                            createdDestinationAgentId
                                                        )
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>
                                <div>
                                    {isModalOpenDestinationAgent &&
                                        selectedDestinationAgent !== null && (
                                            <ModalForm
                                                isOpen={
                                                    isModalOpenDestinationAgent
                                                }
                                                onClose={
                                                    closeModalDestinationAgent
                                                }
                                            >
                                                <ForwardingAgentsCreationForm
                                                    forwardingAgent={
                                                        selectedDestinationAgent
                                                    }
                                                    closeModal={
                                                        closeModalDestinationAgent
                                                    }
                                                    creating={false}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={
                                                        handleProcessCompleteDestinationAgent
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>
                                {/* terminacion de Forms creacion y edicion carrier */}
                            </div>
                            <div className="col-6 text-start">
                                <label
                                    className="copy-label_add"
                                    onClick={handleAddDestinationAgentClick}
                                >
                                    <i className="fas fa-plus button-icon fa-3x"></i>
                                </label>
                                <label
                                    className="copy-label_edit"
                                    onClick={handleEditDestinationAgentClick}
                                >
                                    <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                </label>
                            </div>

                            <div className="row mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="issuedBy"
                                        className="form-label"
                                    >
                                        Issued By:
                                    </label>
                                    <AsyncSelect
                                        id="issuedBy"
                                        onChange={(e) => {
                                            handleIssuedBySelection(e);
                                        }}
                                        value={issuedByOptions.find(
                                            (option) =>
                                                option.id ===
                                                formData.issuedById
                                        )}
                                        isClearable={true}
                                        placeholder="Search and select..."
                                        defaultOptions={issuedByOptions}
                                        loadOptions={loadIssuedBySelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        key={issuedByOptions.length} // Add esto para que se refresque la lista
                                    />

                                    <div>
                                        {isModalOpenAgent &&
                                            selectedAgent !== null && (
                                                <ModalForm
                                                    isOpen={isModalOpenAgent}
                                                    onClose={closeModalAgent}
                                                >
                                                    <ForwardingAgentsCreationForm
                                                        forwardingAgent={
                                                            selectedAgent
                                                        }
                                                        closeModal={
                                                            closeModalAgent
                                                        }
                                                        creating={false}
                                                        fromPickupOrder={true}
                                                        onProcessComplete={
                                                            handleProcessCompleteAgent
                                                        }
                                                    />
                                                </ModalForm>
                                            )}
                                    </div>
                                    <div>
                                        {isModalOpenAgent &&
                                            selectedAgent === null && (
                                                <ModalForm
                                                    isOpen={isModalOpenAgent}
                                                    onClose={closeModalAgent}
                                                >
                                                    <ForwardingAgentsCreationForm
                                                        forwardingAgent={null}
                                                        closeModal={
                                                            closeModalAgent
                                                        }
                                                        creating={true}
                                                        fromPickupOrder={true}
                                                        onProcessComplete={(
                                                            createdAgentId
                                                        ) =>
                                                            handleProcessCompleteAgent(
                                                                createdAgentId
                                                            )
                                                        }
                                                    />
                                                </ModalForm>
                                            )}
                                    </div>
                                    {/* terminacion de Forms creacion y edicion Agent */}
                                </div>

                                <div className="col-6 text-start">
                                    <Input
                                        type="number"
                                        inputName="entryNumber"
                                        placeholder="Entry Number..."
                                        value={formData.entryNumber}
                                        label="Entry Number"
                                    />
                                </div>
                            </div>
                            <div className="col-6 text-start">
                                <label
                                    className="copy-label_add"
                                    onClick={handleAddAgentClick}
                                >
                                    <i className="fas fa-plus button-icon fa-3x"></i>
                                </label>
                                <label
                                    className="copy-label_edit"
                                    onClick={handleEditAgentClick}
                                >
                                    <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                </label>
                                {/* Forms creacion y edicion Agent */}
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h3>Shipper/Consignee</h3>
                                <span></span>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="shipper"
                                        className="form-label"
                                    >
                                        Shipper:
                                    </label>
                                    <AsyncSelect
                                        id="shipper"
                                        value={shipperOptions.find(
                                            (option) =>
                                                option.id ===
                                                    formData.shipperId &&
                                                option.type_person ===
                                                    formData.shipperType
                                        )}
                                        onChange={(e) =>
                                            handleShipperSelection(e)
                                        }
                                        isClearable={true}
                                        placeholder="Search and select..."
                                        defaultOptions={shipperOptions}
                                        loadOptions={loadShipperSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                    />
                                </div>

                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="consignee"
                                        className="form-label"
                                    >
                                        Consignee:
                                    </label>
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
                                        loadOptions={loadConsigneeSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                    />
                                </div>
                                {/* Forms creacion y edicion carrier */}
                                <div>
                                    {isModalOpenConsignee &&
                                        selectedConsignee === null && (
                                            <ModalForm
                                                isOpen={isModalOpenConsignee}
                                                onClose={closeModalConsignee}
                                            >
                                                <CustomerCreationForm
                                                    customer={null}
                                                    closeModal={
                                                        closeModalConsignee
                                                    }
                                                    creating={true}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={(
                                                        createdConsigneeId
                                                    ) =>
                                                        handleProcessCompleteConsignee(
                                                            createdConsigneeId
                                                        )
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>
                                <div>
                                    {isModalOpenConsignee &&
                                        selectedConsignee !== null && (
                                            <ModalForm
                                                isOpen={isModalOpenConsignee}
                                                onClose={closeModalConsignee}
                                            >
                                                <CustomerCreationForm
                                                    customer={selectedConsignee}
                                                    closeModal={
                                                        closeModalConsignee
                                                    }
                                                    creating={false}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={
                                                        handleProcessCompleteConsignee
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>

                                {/* Forms creacion y edicion carrier */}
                                <div>
                                    {isModalOpenShipper &&
                                        selectedShipp === null && (
                                            <ModalForm
                                                isOpen={isModalOpenShipper}
                                                onClose={closeModalShipper}
                                            >
                                                <CustomerCreationForm
                                                    customer={null}
                                                    closeModal={
                                                        closeModalShipper
                                                    }
                                                    creating={true}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={(
                                                        createdShipperId
                                                    ) =>
                                                        handleProcessCompleteShipper(
                                                            createdShipperId
                                                        )
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>
                                <div>
                                    {isModalOpenShipper &&
                                        selectedShipp !== null && (
                                            <ModalForm
                                                isOpen={isModalOpenShipper}
                                                onClose={closeModalShipper}
                                            >
                                                <CustomerCreationForm
                                                    customer={selectedShipp}
                                                    closeModal={
                                                        closeModalShipper
                                                    }
                                                    creating={false}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={
                                                        handleProcessCompleteShipper
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>
                                {/* terminacion de Forms creacion y edicion shipper */}
                            </div>

                            <div className="row align-items-center mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        className="copy-label_add"
                                        onClick={handleAddShipperClick}
                                    >
                                        <i className="fas fa-plus button-icon fa-3x"></i>
                                    </label>
                                    <label
                                        className="copy-label_edit"
                                        onClick={handleEditShipperClick}
                                    >
                                        <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                    </label>
                                </div>

                                <div className="col-6 text-start">
                                    <label
                                        className="copy-label_add"
                                        onClick={handleAddConsigneeClick}
                                    >
                                        <i className="fas fa-plus button-icon fa-3x"></i>
                                    </label>
                                    <label
                                        className="copy-label_edit"
                                        onClick={handleEditConsigneeClick}
                                    >
                                        <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                    </label>
                                </div>
                            </div>

                            <div className="row align-items-center mb-3">
                                <div className="col-6 text-start">
                                    <Input
                                        type="textarea"
                                        inputName="shipperinfo"
                                        placeholder="Shipper Location..."
                                        value={formData.shipperInfo}
                                        readonly={true}
                                    />
                                </div>

                                <div className="col-6 text-start">
                                    <Input
                                        type="textarea"
                                        inputName="consigneeInfo"
                                        placeholder="Consignee Info..."
                                        value={formData.consigneeInfo}
                                        readonly={true}
                                        label=""
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="clientToBill"
                                        className="form-label"
                                    >
                                        Client to Bill:
                                    </label>
                                    <select
                                        value={formData.clientToBillType}
                                        name="clientToBill"
                                        id="clientToBill"
                                        onChange={(e) =>
                                            handleClientToBillSelection(e)
                                        }
                                    >
                                        <option value="">
                                            Select an option
                                        </option>
                                        <option value="consignee">
                                            Consignee
                                        </option>
                                        <option value="shipper">Shipper</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <p style={{ color: 'red' }}>
                                        Note: Always select a client to bill
                                        when editing
                                    </p>
                                </div>
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="clientToBill"
                                        className="form-label"
                                    >
                                        Other Client to Bill:
                                    </label>
                                    <AsyncSelect
                                        id="releasedToOther"
                                        isDisabled={
                                            formData.client_to_bill_type !==
                                            'other'
                                        }
                                        onChange={(e) => {
                                            handleClientToBillSelection(e);
                                        }}
                                        value={getAsyncSelectValue()}
                                        defaultOptions={releasedToOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row w-100">
                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h3>Supplier</h3>
                                <span></span>
                            </div>
                            <div className="row align-items-center mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="supplier"
                                        className="form-label"
                                    >
                                        Name:
                                    </label>
                                    <AsyncSelect
                                        id="supplier"
                                        onChange={(e) =>
                                            handleSupplierSelection(e)
                                        }
                                        value={supplierOptions.find(
                                            (option) =>
                                                option.id ===
                                                formData.supplierId
                                            // option.id === formData.supplierId &&
                                            // option.type_person === formData.supplierType
                                        )}
                                        isClearable={true}
                                        placeholder="Search and select..."
                                        defaultOptions={supplierOptions}
                                        loadOptions={loadSupplierSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        key={supplierOptions.length} // Add esto para que se refresque la lista
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <Input
                                        type="text"
                                        inputName="invoiceNumber"
                                        placeholder="Invoice Number..."
                                        value={formData.invoiceNumber}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                invoiceNumber: e.target.value,
                                            })
                                        }
                                        label="Invoice Number"
                                    />
                                </div>

                                {/* Forms creacion y edicion Supplier */}
                                <div>
                                    {isModalOpenSupplier &&
                                        selectedSupplier === null && (
                                            <ModalForm
                                                isOpen={isModalOpenSupplier}
                                                onClose={closeModalSupplier}
                                            >
                                                <CustomerCreationForm
                                                    customer={null}
                                                    closeModal={
                                                        closeModalSupplier
                                                    }
                                                    creating={true}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={(
                                                        createdSupplierId
                                                    ) =>
                                                        handleProcessCompleteSupplier(
                                                            createdSupplierId
                                                        )
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>

                                <div>
                                    {isModalOpenSupplier &&
                                        selectedSupplier !== null && (
                                            <ModalForm
                                                isOpen={isModalOpenSupplier}
                                                onClose={closeModalSupplier}
                                            >
                                                <CustomerCreationForm
                                                    customer={selectedSupplier}
                                                    closeModal={
                                                        closeModalSupplier
                                                    }
                                                    creating={false}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={
                                                        handleProcessCompleteSupplier
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>
                                {/* terminacion de Forms creacion y edicion Supplier */}
                            </div>

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <label
                                        className="copy-label_add"
                                        onClick={handleAddSupplierClick}
                                    >
                                        <i className="fas fa-plus button-icon fa-3x"></i>
                                    </label>

                                    <label
                                        className="copy-label_edit"
                                        onClick={handleEditSupplierClick}
                                    >
                                        <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                    </label>
                                </div>
                            </div>

                            <div className="row alig-items-center">
                                <div className="col-6 text-start">
                                    <Input
                                        type="textarea"
                                        inputName="supplierInfo"
                                        placeholder="Supplier Location..."
                                        value={formData.supplierInfo}
                                        readonly={true}
                                    />
                                </div>

                                <div
                                    className="col-6 text-start"
                                    style={{ marginTop: '-5px' }}
                                >
                                    <Input
                                        type="text"
                                        inputName="purchaseOrderNumber"
                                        placeholder="Purchase Order Number..."
                                        value={formData.purchaseOrderNumber}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                purchaseOrderNumber:
                                                    e.target.value,
                                            })
                                        }
                                        label="Purchase Order Number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>Carrier Information</h2>
                                <span></span>
                            </div>
                            <div className="row align-items-center mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="mainCarrier"
                                        className="form-label"
                                    >
                                        Carrier:
                                    </label>
                                    <AsyncSelect
                                        id="mainCarrier"
                                        onChange={(e) => {
                                            handleInlandCarrierSelection(e);
                                        }}
                                        value={carrierOptions.find(
                                            (option) =>
                                                option.id ===
                                                formData.inlandCarrierdId
                                        )}
                                        placeholder="Search and select..."
                                        defaultOptions={carrierOptions}
                                        loadOptions={loadCarrierSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        key={carrierOptions.length} // Add esto para que se refresque la lista
                                    />
                                    {/* labels de creacion y edicion carrier */}

                                    {/* Forms creacion y edicion carrier */}
                                    <div>
                                        {isModalOpenCarrier &&
                                            selectedCarrier === null && (
                                                <ModalForm
                                                    isOpen={isModalOpenCarrier}
                                                    onClose={closeModalCarrier}
                                                >
                                                    <CarrierCreationForm
                                                        carrier={null}
                                                        closeModal={
                                                            closeModalCarrier
                                                        }
                                                        creating={true}
                                                        fromPickupOrder={true}
                                                        onProcessComplete={(
                                                            createdCarrierId
                                                        ) =>
                                                            handleProcessCompleteCarrier(
                                                                createdCarrierId
                                                            )
                                                        }
                                                    />
                                                </ModalForm>
                                            )}
                                    </div>

                                    <div>
                                        {isModalOpenCarrier &&
                                            selectedCarrier !== null && (
                                                <ModalForm
                                                    isOpen={isModalOpenCarrier}
                                                    onClose={closeModalCarrier}
                                                >
                                                    <CarrierCreationForm
                                                        carrier={
                                                            selectedCarrier
                                                        }
                                                        closeModal={
                                                            closeModalCarrier
                                                        }
                                                        creating={false}
                                                        fromPickupOrder={true}
                                                        onProcessComplete={
                                                            handleProcessCompleteCarrier
                                                        }
                                                    />
                                                </ModalForm>
                                            )}
                                    </div>
                                    {/* terminacion de Forms creacion y edicion carrier */}
                                </div>
                                <div className="col-6 text-start">
                                    <Input
                                        id="trackingNumber"
                                        type="text"
                                        inputName="trackingNumber"
                                        value={formData.trackingNumber}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                trackingNumber: e.target.value,
                                            })
                                        }
                                        label="Tracking Number"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <label
                                        className="copy-label_add"
                                        onClick={handleAddCarrierClick}
                                    >
                                        <i className="fas fa-plus button-icon fa-3x"></i>
                                    </label>

                                    <label
                                        className="copy-label_edit"
                                        onClick={handleEditCarrierClick}
                                    >
                                        <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                    </label>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <Input
                                        id="TextMainCarrier"
                                        type="textarea"
                                        inputName="issuedbydata"
                                        value={formData.inlandCarrierdInfo}
                                        readonly={true}
                                        // label="Address"
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <Input
                                        id="proNumber"
                                        type="text"
                                        inputName="proNumber"
                                        value={formData.proNumber}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                proNumber: e.target.value,
                                            })
                                        }
                                        label="PRO Number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="creation creation-container">
                    <div className="form-label_name">
                        {editingComodity ? (
                            <h3 style={{ color: 'blue', fontWeight: 'bold' }}>
                                {' '}
                                Edition
                            </h3>
                        ) : (
                            <h3>Commodities</h3>
                        )}
                        <span></span>
                    </div>
                    <CommodityCreationForm
                        onCancel={setshowCommodityCreationForm}
                        commodities={commodities}
                        setCommodities={setcommodities}
                        setShowCommoditiesCreationForm={
                            setshowCommodityCreationForm
                        }
                        /* added tres parametros */
                        editing={editingComodity}
                        commodity={selectedCommodity}
                        setEditingComodity={setEditingComodity}
                        locationEnabled={true}
                    />
                    <br />

                    {showCommodityCreationForm && (
                        <div className="text-center">
                            <Table
                                noScroll
                                noScrollY
                                data={commodities}
                                columns={[
                                    'Description',
                                    ' Length (in)',
                                    ' Width (in)',
                                    ' Height (in)',
                                    ' Weight (lb)',
                                    ' Location',
                                    ' Volume (ft3)',
                                    ' Volume-Weight (Vlb)',
                                    // " Weight (lb)",
                                    'Hazardous',
                                    'Hazardous Type',
                                    'Options',
                                ]}
                                onSelect={handleSelectCommodity} // Make sure this line is correct
                                selectedRow={selectedCommodity}
                                onDelete={handleCommodityDelete}
                                onEdit={handleCommodityEdit}
                                onInspect={() => {
                                    setshowCommodityInspect(
                                        !showCommodityInspect
                                    );
                                }}
                                onAdd={() => {}}
                                showOptions={false}
                                //added no double click
                                Nodoubleclick={true}
                                /* deleted variable hiden button trash */
                            />
                            {/* added view commodities */}
                            {showCommodityInspect && (
                                <div className="repacking-container">
                                    <div className="main-commodity">
                                        <p className="item-description">
                                            {selectedCommodity.description}
                                        </p>
                                        <p className="item-info">
                                            Weight: {selectedCommodity.weight}
                                        </p>
                                        <p className="item-info">
                                            Height: {selectedCommodity.height}
                                        </p>
                                        <p className="item-info">
                                            Width: {selectedCommodity.width}
                                        </p>
                                        <p className="item-info">
                                            Length: {selectedCommodity.length}
                                        </p>
                                        <p className="item-info">
                                            Volumetric Weight:{' '}
                                            {selectedCommodity.volumetricWeight}
                                        </p>
                                        <p className="item-info">
                                            Chargeable Weight:{' '}
                                            {selectedCommodity.chargedWeight}
                                        </p>
                                        <p className="item-info">
                                            Location:{' '}
                                            {selectedCommodity.locationCode}
                                        </p>
                                        {/* <p className="item-info">Repacked?: {selectedCommodity.containsCommodities ? "Yes" : "No"}</p> */}
                                    </div>
                                    {/*  fix the repacking show internalCommodities for edition */}
                                    {selectedCommodity.internalCommodities &&
                                        selectedCommodity.internalCommodities.map(
                                            (com) => (
                                                <div
                                                    key={com.id}
                                                    className="card"
                                                    style={{
                                                        display: 'flex',
                                                        textAlign: 'left',
                                                        fontSize: '15px',
                                                    }}
                                                >
                                                    <p className="item-description">
                                                        {com.description}
                                                    </p>
                                                    <p className="item-info">
                                                        Weight: {com.weight}
                                                    </p>
                                                    <p className="item-info">
                                                        Height: {com.height}
                                                    </p>
                                                    <p className="item-info">
                                                        Width: {com.width}
                                                    </p>
                                                    <p className="item-info">
                                                        Length: {com.length}
                                                    </p>
                                                    <p className="item-info">
                                                        Volumetric Weight:{' '}
                                                        {com.volumetricWeight}
                                                    </p>
                                                    <p className="item-info">
                                                        Chargeable Weight:{' '}
                                                        {com.chargedWeight}
                                                    </p>
                                                    <p className="item-info">
                                                        Location:{' '}
                                                        {com.locationCode}
                                                    </p>
                                                    {/* <p className="item-info">Repacked?: {com.containsCommodities ? "Yes" : "No"}</p> */}
                                                </div>
                                            )
                                        )}
                                </div>
                            )}
                            <button
                                className="button-save"
                                type="button"
                                onClick={() => {
                                    setshowRepackingForm(!showRepackingForm);
                                }}
                            >
                                Repack
                            </button>
                            <br />
                            <br />
                            <br />

                            {showRepackingForm && (
                                <RepackingForm
                                    commodities={commodities}
                                    setCommodities={setcommodities}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* button duplicado */}
                {/* <button
                  type="button"
                  onClick={() => {
                    setshowRepackingForm(!showRepackingForm);
                  }}
                  className="button-save"
                >
                  Repacking
                </button> */}

                <input type="checkbox" id="toggleBoton"></input>
                <label className="button-charge" htmlFor="toggleBoton"></label>

                <div className="row w-100" id="miDiv">
                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h3>Charges</h3>
                                <span></span>
                            </div>
                            {true && (
                                <IncomeChargeForm
                                    onCancel={setshowIncomeForm}
                                    charges={charges}
                                    setcharges={setcharges}
                                    commodities={commodities}
                                    agent={agent}
                                    consignee={consignee}
                                    shipper={shipper}
                                />
                            )}

                            {showIncomeForm && (
                                <Table
                                    noScroll
                                    noScrollY
                                    data={charges}
                                    columns={[
                                        'Status',
                                        'Type',
                                        'Description',
                                        'Quantity',
                                        'Price',
                                        'Currency',
                                    ]}
                                    onSelect={() => {}} // Make sure this line is correct
                                    selectedRow={{}}
                                    onDelete={() => {}}
                                    onEdit={() => {}}
                                    onAdd={() => {}}
                                    showOptions={false}
                                />
                            )}
                            {showIncomeChargeEditForm && (
                                <IncomeChargeForm
                                    onCancel={setshowIncomeChargeEditForm}
                                    charges={charges}
                                    setcharges={setcharges}
                                    commodities={commodities}
                                    agent={agent}
                                    consignee={consignee}
                                    shipper={shipper}
                                    editing={true}
                                    charge={selectedIncomeCharge}
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h3>Charges</h3>
                                <span></span>
                            </div>
                            {true && (
                                <ExpenseChargeForm
                                    onCancel={setshowIncomeForm}
                                    charges={charges}
                                    setcharges={setcharges}
                                    commodities={commodities}
                                    agent={agent}
                                    consignee={consignee}
                                    shipper={shipper}
                                />
                            )}

                            {showExpenseForm && (
                                <Table
                                    noScroll
                                    noScrollY
                                    data={charges}
                                    columns={[
                                        'Status',
                                        'Type',
                                        'Description',
                                        'Quantity',
                                        'Price',
                                        'Currency',
                                    ]}
                                    onSelect={() => {}} // Make sure this line is correct
                                    selectedRow={{}}
                                    onDelete={() => {}}
                                    onEdit={() => {}}
                                    onAdd={() => {}}
                                    showOptions={false}
                                />
                            )}
                            {showExpenseEditForm && (
                                <ExpenseChargeForm
                                    onCancel={setshowIncomeChargeEditForm}
                                    charges={charges}
                                    setcharges={setcharges}
                                    commodities={commodities}
                                    agent={agent}
                                    consignee={consignee}
                                    shipper={shipper}
                                    editing={true}
                                    charge={selectedIncomeCharge}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="creation creation-container">
                    <div className="form-label_name">
                        <h3>Events</h3>
                        <span></span>
                    </div>
                    <div className="row">
                        <div className="col-12 text-start">
                            <div className="container-box event-section">
                                <div className="box__event--form">
                                    <EventCreationForm
                                        onCancel={setshowEventForm}
                                        events={events}
                                        setevents={setEvents}
                                    />
                                </div>
                                {events && events.length > 0 && (
                                    <Table
                                        noScrollY
                                        data={events}
                                        columns={[
                                            // "Date",
                                            ' Creation Date',
                                            // "Name",
                                            'Event Type',
                                            'Details',
                                            'Location',
                                            'Include In Tracking',
                                            'Created In',
                                            // "Created By",
                                            'Created On',
                                            // "Last Modified By",
                                            // "Last Modified On",
                                            'Options', //Mirar como modifico esta parte para q salga solo eliminar y editar
                                        ]}
                                        onSelect={handleSelectEvent}
                                        selectedRow={SelectEvent}
                                        onDelete={() => {}}
                                        onEdit={() => {}}
                                        onAdd={() => {}}
                                        showOptions={false}
                                        importLabel={false}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
                                placeholder="Nota here..."
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
                        // disabled={changeStateSave}
                        className="button-save"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModalConfirm(true);
                            // sendData();
                        }}
                        // disabled={changeStateSave || changeStateButton}
                    >
                        Save
                    </button>

                    <button className="button-cancel" onClick={handleCancel}>
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
                            setChangeStateButton(true);
                        }}
                        onCancel={() => setShowModalConfirm(false)}
                    />
                )}
                {showSuccessAlert && (
                    <Alert
                        severity="success"
                        onClose={() => setShowSuccessAlert(false)}
                        className="alert-notification"
                    >
                        <p className="succes"> Success </p>
                        <p className=" created">
                            {' '}
                            Warehouse Receipt {creating
                                ? 'created'
                                : 'updated'}{' '}
                            successfully!{' '}
                        </p>
                    </Alert>
                )}

                {/* added change estate for warning alert */}
                {showWarningAlert && (
                    <Alert
                        severity="warning"
                        onClose={() => setShowWarningAlert(false)}
                        className="alert-notification-warning"
                    >
                        <p className="succes">
                            {' '}
                            Please fill in data in the commodities section, do
                            not leave empty spaces.
                        </p>
                        <p className="succes"> Don't leave empty fields.</p>
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
                            Error {creating ? 'creating' : 'updating'} Warehouse
                            Receipt. Please try again
                        </strong>
                    </Alert>
                )}
            </div>
        </div>
    );
};

ReceiptCreationForm.propTypes = {
    pickupOrder: propTypes.object,
    closeModal: propTypes.func,
    creating: propTypes.bool,
    onpickupOrderDataChange: propTypes.func,
};

ReceiptCreationForm.defaultProps = {
    pickupOrder: {},
    closeModal: null,
    creating: false,
    onpickupOrderDataChange: null,
};

export default ReceiptCreationForm;
