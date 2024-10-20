import { useState, useEffect, useContext, useForm } from 'react';
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
import PickupService from '../../services/PickupService';
import IncomeChargeForm from './IncomeChargeForm';
import CommodityCreationForm from './CommodityCreationForm';
import AsyncSelect from 'react-select/async';
import ExpenseChargeForm from './ExpenseChargeForm';
import RepackingForm from './RepackingForm';
import ReleaseService from '../../services/ReleaseService';
import '../../styles/components/CreationForm.scss';
import ReceiptService from '../../services/ReceiptService';
import ConfirmModal from '../../views/shared/components/ConfirmModal';
import CarrierCreationForm from '../forms/CarrierCreationForm';
import ForwardingAgentsCreationForm from '../forms/ForwardingAgentCreationForm';
import CustomerCreationForm from '../forms/CustomerCreationForm';
import ModalForm from '../shared/components/ModalForm';
import { set } from 'lodash';

const PickupOrderCreationForm = ({
    pickupOrder,
    closeModal,
    creating,
    onpickupOrderDataChange,
    currentPickUpNumber,
    setcurrentPickUpNumber,
    showBModal,
    fromPickUp,
}) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [allStateUpdatesComplete, setAllStateUpdatesComplete] =
        useState(false);
    const [showIncomeForm, setshowIncomeForm] = useState(false);
    const [showExpenseForm, setshowExpenseForm] = useState(false);
    const [agent, setagent] = useState(null);
    const [consignee, setconsignee] = useState(null);
    const [shipper, setshipper] = useState(null);
    const [pickuplocation, setpickuplocation] = useState(null);
    const [deliverylocation, setdeliverylocation] = useState(null);
    const [consigneeRequest, setconsigneeRequest] = useState(null);
    const [shipperRequest, setshipperRequest] = useState(null);
    const [releasedToOptions, setReleasedToOptions] = useState([]);
    const [clientToBillRequest, setclientToBillRequest] = useState(null);
    const [showCommodityCreationForm, setshowCommodityCreationForm] =
        useState(false);
    const [showCommodityEditForm, setshowCommodityEditForm] = useState(false);
    const [showCommodityInspect, setshowCommodityInspect] = useState(false);
    const [showRepackingForm, setshowRepackingForm] = useState(false);
    const [weightUpdated, setWeightUpdated] = useState(0);
    const [volumenUpdated, setVolumenUpdated] = useState(0);
    const [commodities, setcommodities] = useState([]);
    const [charges, setcharges] = useState([]);
    const [consigneeOptions, setConsigneeOptions] = useState([]);
    const [issuedByOptions, setIssuedByOptions] = useState([]);
    const [destinationAgentOptions, setDestinationAgentOptions] = useState([]);
    const [shipperOptions, setShipperOptions] = useState([]);
    const [pickupLocationOptions, setPickupLocationOptions] = useState([]);
    const [deliveryLocationOptions, setDeliveryLocationOptions] = useState([]);
    const [carrierOptions, setCarrierOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const today = dayjs().format('YYYY-MM-DD hh:mm A');
    const pickupNumber = currentPickUpNumber + 1;
    const [defaultValueShipper, setdefaultValueShipper] = useState(null);
    const [defaultValueConsignee, setdefaultValueConsignee] = useState(null);
    const [canRender, setcanRender] = useState(false);
    const [selectedCommodity, setselectedCommodity] = useState(null);
    const [CTBType, setCTBType] = useState('');
    const [editingComodity, setEditingComodity] = useState(false);
    //added events y attachments para save commodities
    const [events, setEvents] = useState([]);
    const [attachments, setattachments] = useState([]);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    //added status consts
    const StatusArriving = 5;
    //added  carrier modal
    const [isModalOpenCarrier, setIsModalOpenCarrier] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState(null);
    const [isProcessCompleteCarrier, setIsProcessCompleteCarrier] =
        useState(false);
    //added  Agent modal
    const [isModalOpenAgent, setIsModalOpenAgent] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isProcessCompleteAgent, setIsProcessCompleteAgent] = useState(false);
    //added  Shipper modal
    const [isModalOpenShipper, setIsModalOpenShipper] = useState(false);
    const [selectedShipp, setSelectedShipper] = useState(null);
    const [isProcessCompleteShipper, setIsProcessCompleteShipper] =
        useState(false);
    //added  Delivery Location modal
    const [isModalOpenDeliLocation, setIsModalOpenDeliLocation] =
        useState(false);
    const [selectedDeliLocation, setSelectedDeliLocation] = useState(null);
    const [isProcessCompleteDeliLocation, setIsProcessCompleteDeliLocation] =
        useState(false);
    //added  Consignee modal
    const [isModalOpenConsignee, setIsModalOpenConsignee] = useState(false);
    const [selectedConsignee, setSelectedConsignee] = useState(null);
    const [isProcessCompleteConsignee, setIsProcessCompleteConsignee] =
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
    //added  Pick-up Location modal
    const [isModalOpenPickUpLocation, setIsModalOpenPickUpLocation] =
        useState(false);
    const [selectedPickUpLocation, setSelectedPickUpLocation] = useState(null);
    const [
        isProcessCompletePickUpLocation,
        setIsProcessCompletePickUpLocation,
    ] = useState(false);

    const formFormat = {
        status: 14,
        number: pickupNumber,
        createdDateAndTime: today,
        pickupDateAndTime: today,
        deliveryDateAndTime: today,
        issuedById: '',
        issuedByType: '',
        issuedByInfo: '',

        destinationAgentId: '',
        destinationAgentInfo: '',
        employeeId: '',

        shipperId: '',
        shipperType: '',
        shipperInfo: '',
        pickupLocationId: '',
        pickupLocationType: '',
        pickupLocationInfo: '',

        consigneeId: '',
        consigneeType: '',
        consigneeInfo: '',
        deliveryLocationId: '',
        deliveryLocationType: '',
        deliveryLocationInfo: '',
        client_to_bill: '',
        client_to_bill_type: '',

        proNumber: '',
        trackingNumber: '',
        mainCarrierdId: '',
        mainCarrierInfo: '',

        inlandCarrierdId: '',
        inlandCarrierdInfo: '',

        invoiceNumber: '',
        purchaseOrderNumber: '',

        commodities: [],
    };
    const [formData, setFormData] = useState(formFormat);

    //-------------------------------------------------------------
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

        const destinationAgentOptions = [...forwardingAgentsWithType];

        const employeeOptions = [...employeesWithType];

        const shipperOptions = [...customersWithType];

        const pickupLocationOptions = [
            ...customersWithType,
            // ...vendorsWithType,
            // ...forwardingAgentsWithType,
        ];
        // const pickupLocationOptions   = [...customersWithType, ...vendorsWithType];

        const consigneeOptions = [...customersWithType];

        const deliveryLocationOptions = [
            ...customersWithType,
            // ...vendorsWithType,
            // ...forwardingAgentsWithType,
            // ...carriersWithType,
        ];

        const carrierOptions = [...carriersWithType];

        const clientToBillOptions = [
            ...customersWithType,
            // ...forwardingAgentsWithType,
        ];

        setIssuedByOptions(issuedByOptions.sort(SortArray));
        setDestinationAgentOptions(destinationAgentOptions.sort(SortArray));
        setEmployeeOptions(employeeOptions.sort(SortArray));
        setShipperOptions(shipperOptions.sort(SortArray));
        setPickupLocationOptions(pickupLocationOptions.sort(SortArray));
        setConsigneeOptions(consigneeOptions.sort(SortArray));
        setDeliveryLocationOptions(deliveryLocationOptions.sort(SortArray));
        setCarrierOptions(carrierOptions.sort(SortArray));
        setReleasedToOptions(clientToBillOptions.sort(SortArray));
    };

    useEffect(() => {}, [employeeOptions, formData.employeeId]);

    const handleIssuedBySelection = async (event) => {
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
            issuedById: id,
            issuedByType: type,
            issuedByInfo: info,
        });
        setSelectedAgent(result?.data);
        console.log('setSelectedAgent', setSelectedAgent);
    };

    const handlePickUpSelection = async (event) => {
        const id = event?.id || '';
        const type = event?.type || '';
        const result = await CustomerService.getCustomerById(id);
        const info = `${result?.data.street_and_number || ''} - ${
            result?.data.city || ''
        } - ${result?.data.state || ''} - ${result?.data.country || ''} - ${
            result?.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            pickupLocationId: id,
            pickupLocationInfo: info,
            pickupLocationType: type,
        });
        setSelectedPickUpLocation(result?.data); // Set the selected carrier
        console.log('setSelectedPickUpLocation', selectedPickUpLocation);
    };

    const handleSelectCommodity = (commodity) => {
        setselectedCommodity(commodity);
    };

    const handleDeliveryLocationSelection = async (event) => {
        const id = event?.id || '';
        const type = event?.type || '';
        const result = await CustomerService.getCustomerById(id);
        const info = `${result?.data.street_and_number || ''} - ${
            result?.data.city || ''
        } - ${result?.data.state || ''} - ${result?.data.country || ''} - ${
            result?.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            deliveryLocationId: id,
            deliveryLocationInfo: info,
            deliveryLocationType: type,
        });
        setSelectedDeliLocation(result?.data); // Set the selected carrier
        console.log('setSelectedDeliLocation', setSelectedDeliLocation);
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

    const handleEmployeeSelection = async (event) => {
        const id = event?.id;
        setFormData({
            ...formData,
            employeeId: id,
        });
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

    const handleCommodityDelete = () => {
        const newCommodities = commodities.filter(
            (com) => com.id != selectedCommodity.id
        );
        setcommodities(newCommodities);
    };

    const handleMainCarrierSelection = async (event) => {
        const id = event?.id || '';
        const result = await CarrierService.getCarrierById(id);
        const info = `${result?.data.street_and_number || ''} - ${
            result?.data.city || ''
        } - ${result?.data.state || ''} - ${result?.data.country || ''} - ${
            result?.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            mainCarrierdId: id,
            mainCarrierdInfo: info,
        });
        setSelectedCarrier(result?.data); // Set the selected carrier
        console.log('setSelectedCarrier', setSelectedCarrier);
    };

    const handleInlandCarrierSelection = async (event) => {
        const id = event?.id || '';
        const result = await CarrierService.getCarrierById(id);
        const info = `${result?.data.street_and_number || ''} - ${
            result?.data.city || ''
        } - ${result?.data.state || ''} - ${result?.data.country || ''} - ${
            result?.data.zip_code || ''
        }`;
        setFormData({
            ...formData,
            inlandCarrierdId: id,
            inlandCarrierdInfo: info,
        });
        setSelectedCarrier(result?.data); // Set the selected carrier
        console.log('setSelectedCarrier', setSelectedCarrier);
    };

    const handleClientToBillSelection = async (event) => {
        const type = event?.target?.value || '';

        if (type === 'other') {
            setFormData({ ...formData, client_to_bill_type: type });
        } else if (type === 'shipper' || type === 'consignee') {
            if (formData.shipperId || formData.consigneeId) {
                const id =
                    type === 'shipper'
                        ? formData.shipperId
                        : formData.consigneeId;
                setFormData({
                    ...formData,
                    client_to_bill_type: type,
                    client_to_bill: id,
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
                client_to_bill_type: type,
                client_to_bill: id,
            });
        }
    };

    //added handle carrier creation
    const handleAddCarrierClick = () => {
        setSelectedCarrier(null);
        setIsModalOpenCarrier(true);
    };
    const handleEditCarrierClick = () => {
        if (formData.inlandCarrierdId) {
            const carrierToEdit = carrierOptions.find(
                (carrierv) => carrierv.id === formData.inlandCarrierdId
            );
            setSelectedCarrier(carrierToEdit);
            setIsModalOpenCarrier(true);
        } else {
            alert('Please select a Carrier to edit.');
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
        //setSelectedCarrier(null);
    };

    //--------------------------------------------------------------
    //added handle Agent creation
    const handleAddAgentClick = () => {
        setSelectedAgent(null);
        setIsModalOpenAgent(true);
    };
    const handleEditAgentClick = () => {
        if (formData.issuedById) {
            const issuedByToEdit = issuedByOptions.find(
                (issuedv) => issuedv.id === formData.issuedById
            );
            setSelectedAgent(issuedByToEdit);
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
        //setSelectedAgent(null);
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
                // Actualizar las opciones
                setShipperOptions(options);
                setPickupLocationOptions(options);
                setReleasedToOptions(options);
                setDeliveryLocationOptions(options);
                setConsigneeOptions(options);
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
    //added handle DeliLocation creation
    const handleAddDeliLocationClick = () => {
        setSelectedDeliLocation(null);
        setIsModalOpenDeliLocation(true);
    };
    const handleEditDeliLocationClick = () => {
        if (formData.deliveryLocationId) {
            const deliveryLocationToEdit = deliveryLocationOptions.find(
                (deliLocationv) =>
                    deliLocationv.id === formData.deliveryLocationId
            );
            setSelectedDeliLocation(deliveryLocationToEdit);
            setIsModalOpenDeliLocation(true);
        } else {
            alert('Please select a Delivery Location to edit.');
        }
    };
    const closeModalDeliLocation = () => {
        setIsModalOpenDeliLocation(false);
        setSelectedDeliLocation(null);
    };
    const handleProcessCompleteDeliLocation = async (
        createdDeliLocationId = null
    ) => {
        setIsProcessCompleteDeliLocation(true);
        setIsModalOpenDeliLocation(false);
        console.log('Proceso completado en DeliveryCreationForm');

        // Si se creó un nuevo Delivery location, utilice su ID; de lo contrario, utilice el deliveryLocationId existente
        const DeliLocationId =
            createdDeliLocationId || formData.deliveryLocationId;

        if (DeliLocationId) {
            //await handleDeliveryLocationSelection({ id: DeliLocationId });

            // Obtener y actualizar las opciones del delivery
            const updatedOptions = await loadDeliLocationSelectOptions('');
            setDeliveryLocationOptions(updatedOptions);

            const updatedDeliveryLocation = updatedOptions.find(
                (shipper) => shipper.id === DeliLocationId
            );

            if (updatedDeliveryLocation) {
                handleDeliveryLocationSelection(updatedDeliveryLocation);
            }
        }

        // Restablecer el delivery seleccionado después del procesamiento
        //setSelectedDeliLocation(null);
    };

    //Muy importante para despues de add/edit recarcargar opciones de deliverylocation!!
    useEffect(() => {
        if (isProcessCompleteDeliLocation) {
            loadDeliLocationSelectOptions('').then((options) => {
                // Actualizar las opciones
                setShipperOptions(options);
                setPickupLocationOptions(options);
                setReleasedToOptions(options);
                setDeliveryLocationOptions(options);
                setConsigneeOptions(options);
                if (selectedDeliLocation) {
                    const updateddeliveryLocationChanged = options.find(
                        (option) => option.id === selectedDeliLocation.id
                    );
                    if (updateddeliveryLocationChanged) {
                        handleDeliveryLocationSelection(
                            updateddeliveryLocationChanged
                        );
                    }
                }
                setIsProcessCompleteDeliLocation(false);
            });
        }
    }, [isProcessCompleteDeliLocation, selectedDeliLocation]);

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
        //setSelectedDestinationAgent(null);
    };

    //--------------------------------------------------------------
    //added handle Pick-up Location creation
    const handleAddPickUpLocationClick = () => {
        setSelectedPickUpLocation(null);
        setIsModalOpenPickUpLocation(true);
    };
    const handleEditPickUpLocationClick = () => {
        if (formData.pickupLocationId) {
            const PickupLocationvToEdit = pickupLocationOptions.find(
                (pickupLocationv) =>
                    pickupLocationv.id === formData.pickupLocationId
            );
            setSelectedPickUpLocation(PickupLocationvToEdit);
            setIsModalOpenPickUpLocation(true);
        } else {
            alert('Please select a Pick-up Location to edit.');
        }
    };
    const closeModalPickUpLocation = () => {
        setIsModalOpenPickUpLocation(false);
        setSelectedPickUpLocation(null);
    };
    const handleProcessCompletePickUpLocation = async (
        createdPickUpLocationId = null
    ) => {
        setIsProcessCompletePickUpLocation(true);
        setIsModalOpenPickUpLocation(false);
        console.log('Proceso completado en CustomerCreationForm');

        // Si se creó un nuevo customer, utilice su ID; de lo contrario, utilice el pickupLocationId existente
        const PickLocationId =
            createdPickUpLocationId || formData.pickupLocationId;

        if (PickLocationId) {
            //await handlePickUpSelection({ id: PickLocationId });

            // Obtener y actualizar las opciones del Customer
            const updatedOptions = await loadPickUpLocationSelectOpt('');
            setPickupLocationOptions(updatedOptions);
            const updatedpickupLocation = updatedOptions.find(
                (shipper) => shipper.id === PickLocationId
            );

            if (updatedOptions) {
                handlePickUpSelection(updatedpickupLocation);
            }
        }

        // Restablecer el PickUpLocation seleccionado después del procesamiento
        //setSelectedPickUpLocation(null);
    };
    //Muy importante para despues de add/edit recarcargar opciones de pickupl location!!
    useEffect(() => {
        if (isProcessCompletePickUpLocation) {
            loadPickUpLocationSelectOpt('').then((options) => {
                // Actualizar las opciones
                setShipperOptions(options);
                setPickupLocationOptions(options);
                setReleasedToOptions(options);
                setDeliveryLocationOptions(options);
                setConsigneeOptions(options);
                if (selectedPickUpLocation) {
                    const updatedpickupLocationchanged = options.find(
                        (option) => option.id === selectedPickUpLocation.id
                    );
                    if (updatedpickupLocationchanged) {
                        handlePickUpSelection(updatedpickupLocationchanged);
                    }
                }
                setIsProcessCompletePickUpLocation(false);
            });
        }
    }, [isProcessCompletePickUpLocation, selectedPickUpLocation]);

    //--------------------------------------------------------------

    useEffect(() => {
        if (!creating && pickupOrder != null) {
            setcommodities(pickupOrder.commodities);
            setcharges(pickupOrder.charges);
            setshowCommodityCreationForm(true);
            loadShipperOption(
                pickupOrder.shipperObj?.data?.obj?.id,
                pickupOrder.shipperObj?.data?.obj?.type_person
            );
            loadConsigneeOption(
                pickupOrder.consigneeObj?.data?.obj?.id,
                pickupOrder.consigneeObj?.data?.obj?.type_person
            );
            let updatedFormData = {
                status: pickupOrder.status,
                weight: pickupOrder.weight,
                volumen: pickupOrder.volumen,
                number: pickupOrder.number,
                createdDateAndTime: pickupOrder.creation_date,
                pickupDateAndTime: pickupOrder.pick_up_date,
                deliveryDateAndTime: pickupOrder.delivery_date,
                destinationAgentInfo: `${
                    pickupOrder.destination_agentObj?.street_and_number || ''
                }- ${pickupOrder.destination_agentObj?.city || ''} - ${
                    pickupOrder.destination_agentObj?.state || ''
                } - ${pickupOrder.destination_agentObj?.country || ''} - ${
                    pickupOrder.destination_agentObj?.zip_code || ''
                } `,
                issuedById: pickupOrder.issued_by,
                issuedByType: pickupOrder.issued_byObj?.type,
                issuedByInfo: `${pickupOrder.issued_byObj?.street_and_number || ''} - ${
                    pickupOrder.issued_byObj?.city || ''
                } - ${pickupOrder.issued_byObj?.state || ''} - ${
                    pickupOrder.issued_byObj?.country || ''
                } - ${pickupOrder.issued_byObj?.zip_code || ''}`,
                destinationAgentId: pickupOrder.destination_agent,
                employeeId: pickupOrder.employee,
                employeeByName: pickupOrder.employeeObj?.data?.obj?.name,

                shipperId: pickupOrder.shipperObj?.data?.obj?.id,
                shipperType:
                    pickupOrder.shipperObj?.data?.obj?.type_person !== 'agent'
                        ? pickupOrder.shipperObj?.data?.obj?.type_person
                        : 'forwardingAgent',
                shipperInfo: `${
                    pickupOrder.shipperObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.city || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.state || ''
                } - ${pickupOrder.shipperObj?.data?.obj?.country || ''} - ${
                    pickupOrder.shipperObj?.data?.obj?.zip_code || ''
                }`,

                pickupLocationId: pickupOrder.pickUpLocationObj?.data?.obj?.id,
                pickupLocationInfo: `${
                    pickupOrder.pickUpLocationObj?.data?.obj
                        ?.street_and_number || ''
                } - ${pickupOrder.pickUpLocationObj?.data?.obj?.city || ''} - ${
                    pickupOrder.pickUpLocationObj?.data?.obj?.state || ''
                } - ${pickupOrder.pickUpLocationObj?.data?.obj?.country || ''} - ${
                    pickupOrder.pickUpLocationObj?.data?.obj?.zip_code || ''
                }`,
                pickupLocationType:
                    pickupOrder.pickUpLocationObj?.data?.obj?.type_person !==
                    'agent'
                        ? pickupOrder.pickUpLocationObj?.data?.obj?.type_person
                        : 'forwardingAgent',

                consigneeId: pickupOrder.consigneeObj?.data?.obj?.id,
                consigneeInfo: `${
                    pickupOrder.consigneeObj?.data?.obj?.street_and_number || ''
                } - ${pickupOrder.consigneeObj?.data?.obj?.city || ''} - ${
                    pickupOrder.consigneeObj?.data?.obj?.state || ''
                } - ${pickupOrder.consigneeObj?.data?.obj?.country || ''} - ${
                    pickupOrder.consigneeObj?.data?.obj?.zip_code || ''
                }`,
                consigneeType: pickupOrder.consigneeObj?.data?.obj?.type_person,
                deliveryLocationId:
                    pickupOrder.deliveryLocationObj?.data?.obj?.id,
                deliveryLocationType:
                    pickupOrder.deliveryLocationObj?.data?.obj?.type_person !==
                    'agent'
                        ? pickupOrder.deliveryLocationObj?.data?.obj
                              ?.type_person
                        : 'forwardingAgent',
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

                mainCarrierdId: pickupOrder.main_carrier,

                invoiceNumber: pickupOrder.invoice_number,
                purchaseOrderNumber: pickupOrder.purchase_order_number,

                commodities: pickupOrder.commodities,
                charges: pickupOrder.charges,
                client_to_billById: pickupOrder.client_to_billObj?.data?.obj
                    ?.data?.obj?.id
                    ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
                    : pickupOrder.client_to_billObj?.data?.obj?.id,
                client_to_bill: pickupOrder.client_to_billObj?.data?.obj?.data
                    ?.obj?.id
                    ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
                    : pickupOrder.client_to_billObj?.data?.obj?.id,
                client_to_bill_type: pickupOrder.client_to_billObj?.data?.obj
                    ?.data?.obj?.type_person
                    ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj
                          ?.id === pickupOrder.shipperObj?.data?.obj?.id
                        ? 'shipper'
                        : pickupOrder.client_to_billObj?.data?.obj?.data?.obj
                                ?.id === pickupOrder.consigneeObj?.data?.obj?.id
                          ? 'consignee'
                          : 'other'
                    : 'other',
            };
            console.log('updatedFormData', updatedFormData);
            let temp = pickupOrder.client_to_billObj?.data?.obj?.data?.obj
                ?.type_person
                ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj
                      ?.type_person
                : pickupOrder.client_to_billObj?.data?.obj?.type_person;
            setCTBType(temp !== 'agent' ? temp : 'forwardingAgent');
            handleClientToBillSelection({
                id: pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
                    ? pickupOrder.client_to_billObj?.data?.obj?.data?.obj?.id
                    : pickupOrder.client_to_billObj?.data?.obj?.id,
                type: temp !== 'agent' ? temp : 'forwardingAgent',
            });
            setFormData(updatedFormData);
            setcanRender(true);
        }
    }, [creating, pickupOrder]);

    useEffect(() => {
        if (charges.length > 0) {
            setshowExpenseForm(true);
            setshowIncomeForm(true);
        }
    }, [charges.length]);

    const SortArray = (x, y) => {
        return new Intl.Collator('es').compare(x.name, y.name);
    };

    const addTypeToObjects = (arr, type) =>
        arr.map((obj) => ({ ...obj, type }));

    const loadEmployeeSelectOptions = async (inputValue) => {
        const response = await EmployeeService.search(inputValue);
        const data = response.data.results;

        const options = addTypeToObjects(data, 'employee');
        options.sort(SortArray);
        return options;
    };

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

        return options;
    };

    const loadDestinationAgentsSelectOptions = async (inputValue) => {
        const responseAgents = (await ForwardingAgentService.search(inputValue))
            .data.results;

        const options = [
            ...addTypeToObjects(responseAgents, 'forwardingAgent'),
        ];
        options.sort(SortArray);
        return options;
    };

    const loadPickUpLocationSelectOptions = async (inputValue) => {
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

        return options;
    };

    const loadDeliveryLocationSelectOptions = async (inputValue) => {
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
        ];

        return options;
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
    //------------------
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
        const options = addTypeToObjects(responseAgents, 'forwardingAgent');
        options.sort(SortArray);
        return options;
    };
    //------------------
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
    //------------------
    //added para recargar DeliveryOptions al crear un Delivery
    useEffect(() => {
        const initializeDeliLocationOptions = async () => {
            const initialOptions = await loadDeliLocationSelectOptions('');
            setDeliveryLocationOptions(initialOptions);
        };

        initializeDeliLocationOptions();
    }, []);

    const loadDeliLocationSelectOptions = async (inputValue) => {
        const responseDeliLocation = (await CustomerService.search(inputValue))
            .data.results;
        return addTypeToObjects(responseDeliLocation, 'customer').sort(
            SortArray
        );
    };
    //------------------
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
    //-----------------
    // added para recargar carriersoptions al crear un carrier
    useEffect(() => {
        const initializePickUpLocationOptions = async () => {
            const initialOptions = await loadPickUpLocationSelectOpt('');
            setPickUpLocationOptions(initialOptions);
        };

        initializePickUpLocationOptions();
    }, []);

    const loadPickUpLocationSelectOpt = async (inputValue) => {
        const responsePickUpLocation = (
            await CustomerService.search(inputValue)
        ).data.results;
        return addTypeToObjects(responsePickUpLocation, 'customer').sort(
            SortArray
        );
    };
    //-----------------
    const loadClientToBillSelectOptions = async (inputValue) => {
        const responseCustomers = (await CustomerService.search(inputValue))
            .data.results;
        const responseAgents = (await ForwardingAgentService.search(inputValue))
            .data.results;

        const options = [
            ...addTypeToObjects(responseCustomers, 'customer'),
            ...addTypeToObjects(responseAgents, 'forwardingAgent'),
        ];

        return options;
    };

    const loadShipperOption = async (id, type) => {
        let option = null;
        if (type === 'customer') {
            option = await CustomerService.getCustomerById(id);
        }
        if (type === 'vendor') {
            option = await VendorService.getVendorByID(id);
        }
        if (type === 'agent') {
            option = await ForwardingAgentService.getForwardingAgentById(id);
        }
        if (type === 'Carrier') {
            option = await CarrierService.getCarrierById(id);
        }
        setdefaultValueShipper(option?.data);
    };

    const loadConsigneeOption = async (id, type) => {
        let option = null;
        if (type === 'customer') {
            option = await CustomerService.getCustomerById(id);
        }
        if (type === 'vendor') {
            option = await VendorService.getVendorByID(id);
        }
        if (type === 'agent') {
            option = await ForwardingAgentService.getForwardingAgentById(id);
        }
        if (type === 'Carrier') {
            option = await CarrierService.getCarrierById(id);
        }
        setdefaultValueConsignee(option?.data);
    };

    useEffect(() => {
        fetchFormData();
    }, []);

    useEffect(() => {}, [formData.pickupLocationId]);

    useEffect(() => {
        if (creating) {
            setFormData({ ...formData, number: pickupNumber });
        }
    }, [pickupNumber]);

    const listId = [
        { selectedId: '#pickupnumber', asociatedId: '#pickupnumber' },
        { selectedId: '#issuedById > div', asociatedId: '#issuedById > div' },
        { selectedId: '#employeeId  > div', asociatedId: '#employeeId > div' },
        {
            selectedId: '#creationdateandtime',
            asociatedId: '#creationdateandtime',
        },
        { selectedId: '#pickupdateandtime', asociatedId: '#pickupdateandtime' },
        {
            selectedId: '#deliverydateandtime',
            asociatedId: '#deliverydateandtime',
        },
        { selectedId: '#shipper > div', asociatedId: '#shipperinfo' },
        // { selectedId: "#pickupLocation > div", asociatedId: "#pickupinfo" },
        {
            selectedId: '#pickupLocation > div',
            asociatedId: '#pickupLocationInfo',
        },
        { selectedId: '#consignee > div', asociatedId: '#consigneeInfo' },
        { selectedId: '#deliveryLocation > div', asociatedId: '#deliveryInfo' },
        {
            selectedId: '#destinationAgentId > div',
            asociatedId: '#destinationAgentId > div',
        },
        { selectedId: '#mainCarrier > div', asociatedId: '#issuedbydata' },
        { selectedId: '#invoiceNumber', asociatedId: '#invoiceNumber' },
        { selectedId: '#trackingNumber', asociatedId: '#trackingNumber' },
        { selectedId: '#proNumber', asociatedId: '#proNumber' },
        {
            selectedId: '#purchaseOrderNumber',
            asociatedId: '#purchaseOrderNumber',
        },
    ];

    useEffect(() => {
        if (commodities && commodities.length >= 1) {
            setFormData({ ...formData, status: 5 });
        }
    }, [commodities]);

    const [inputStyle, setinputStyle] = useState({});
    const sendData = async () => {
        for (const inputs of listId) {
            const inputSelected = document.querySelector(inputs.selectedId);
            const inputAsociated = document.querySelector(inputs.asociatedId);
            const isValid = true; //inputSelected && inputAsociated && !(inputAsociated.value === "" || inputAsociated.value === null || inputAsociated.value === undefined)

            if (inputSelected && formData[inputSelected.id]) {
                inputSelected.style.border = '1px solid green';
                console.log(
                    'formData[inputSelected.id]',
                    formData[inputSelected.id]
                );
                continue;
            } else {
                console.log('inputSelected', inputSelected);
                console.log('inputAsociated', inputAsociated);
                if (inputSelected) inputSelected.style.border = '1px solid red';

                if (!isValid && inputSelected?.style) {
                    inputSelected.style.border = '1px solid red';
                } else {
                    console.log('entre en el este con: ' + isValid);
                    if (inputSelected)
                        inputSelected.style.border = '1px solid green';
                }
            }
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

        if (commodities.length > 0) {
            let weight = 0;
            commodities.forEach((com) => {
                weight += com.weight;
            });
            setFormData({ ...formData, weight: weight });
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

            const response = await PickupService.createConsignee(consignee);
            if (response.status === 201) {
                formData.client_to_bill_type === 'consignee'
                    ? (auxVar = response.data.id)
                    : '';
                setconsigneeRequest(response.data.id);
            }
        }

        let deliveryLocationName = '';
        if (formData.deliveryLocationType === 'customer') {
            deliveryLocationName = 'customerid';
        }
        if (formData.deliveryLocationType === 'vendor') {
            deliveryLocationName = 'vendorid';
        }
        if (formData.deliveryLocationType === 'forwardingAgent') {
            deliveryLocationName = 'agentid';
        }
        if (formData.deliveryLocationType === 'Carrier') {
            deliveryLocationName = 'carrierid';
        }
        if (deliveryLocationName !== '') {
            const consignee = {
                [deliveryLocationName]: formData.deliveryLocationId,
            };

            const response =
                await PickupService.createDeliveryLocation(consignee);
            if (response.status === 201) {
                setdeliverylocation(response.data.id);
            }
        }

        let pickUpLocationName = '';
        if (formData.pickupLocationType === 'customer') {
            pickUpLocationName = 'customerid';
        }
        if (formData.pickupLocationType === 'vendor') {
            pickUpLocationName = 'vendorid';
        }
        if (formData.pickupLocationType === 'forwardingAgent') {
            pickUpLocationName = 'agentid';
        }
        if (formData.pickupLocationType === 'Carrier') {
            pickUpLocationName = 'carrierid';
        }
        if (pickUpLocationName !== '') {
            const consignee = {
                [pickUpLocationName]: formData.pickupLocationId,
            };

            const response =
                await PickupService.createPickUpLocation(consignee);
            if (response.status === 201) {
                setpickuplocation(response.data.id);
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

            const response = await PickupService.createShipper(consignee);
            if (response.status === 201) {
                formData.client_to_bill_type === 'shipper'
                    ? (auxVar = response.data.id)
                    : '';
                setshipperRequest(response.data.id);
            }
        }

        let clientToBillName = '';

        if (formData.client_to_bill_type === 'other') {
            if (CTBType === 'customer') {
                clientToBillName = 'customerid';
            }
            if (CTBType === 'vendor') {
                clientToBillName = 'vendorid';
            }
            if (CTBType === 'forwardingAgent') {
                clientToBillName = 'agentid';
            }
            if (CTBType === 'carrier') {
                clientToBillName = 'carrierid';
            }
        }
        if (formData.client_to_bill_type === 'shipper') {
            clientToBillName = 'shipperid';
        }
        if (formData.client_to_bill_type === 'consignee') {
            clientToBillName = 'consigneeid';
        }

        if (clientToBillName !== '') {
            const clientToBill = {
                [clientToBillName]:
                    formData.client_to_bill_type === 'shipper' ||
                    formData.client_to_bill_type === 'consignee'
                        ? auxVar
                        : formData.client_to_bill,
            };
            const response =
                await ReleaseService.createClientToBill(clientToBill);
            if (response.status === 201) {
                setclientToBillRequest(response.data.id);
                setFormData({ ...formData, client_to_bill: response.data.id });
            }
        }
    };

    const checkUpdatesComplete = () => {
        if (
            shipperRequest !== null &&
            deliverylocation !== null &&
            pickuplocation !== null &&
            consigneeRequest !== null &&
            clientToBillRequest !== null
        ) {
            setAllStateUpdatesComplete(true);
        }
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
            const isForm = clickedElement.closest('.pickup');

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

    useEffect(() => {
        if (commodities.length > 0) {
            setFormData({ ...formData, status: StatusArriving });
        }
    }, [commodities]);

    useEffect(() => {
        checkUpdatesComplete();
        if (allStateUpdatesComplete) {
            // Convertir createdDateAndTime a ISO 8601
            const isoDate = dayjs(
                formData.createdDateAndTime,
                'YYYY-MM-DD hh:mm A'
            ).toISOString();
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
            const isopickupDate = dayjs(
                formData.pickupDateAndTime,
                'YYYY-MM-DD hh:mm A'
            ).toISOString();
            // # Obtener la fecha y la hora por separado
            let pickData = new Date(isopickupDate);
            let pickyear = pickData.getFullYear();
            let pickmonth = String(pickData.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
            let pickday = String(pickData.getDate()).padStart(2, '0');
            let pickhours = pickData.getHours();
            let pickminutes = String(pickData.getMinutes()).padStart(2, '0');
            // Determinar AM o PM
            let pickampm = pickhours >= 12 ? 'P' : 'A';
            // Convertir horas de 24 horas a 12 horas
            pickhours = pickhours % 12;
            pickhours = pickhours ? pickhours : 12; // La hora 0 debería ser 12
            // Formato: YYYY-MM-DD HH:MM AM/PM
            let pickformattedDateTime = `${pickday}/${pickmonth}/${pickyear}-${pickhours}:${pickminutes}${pickampm}`;
            //-----------------------
            // # Obtener la fecha y la hora por separado
            const isodeliveryDate = dayjs(
                formData.deliveryDateAndTime,
                'YYYY-MM-DD hh:mm A'
            ).toISOString();
            let deliveryData = new Date(isodeliveryDate);
            let deliveryyear = deliveryData.getFullYear();
            let deliverymonth = String(deliveryData.getMonth() + 1).padStart(
                2,
                '0'
            ); // Meses comienzan desde 0
            let deliveryday = String(deliveryData.getDate()).padStart(2, '0');
            let deliveryhours = deliveryData.getHours();
            let deliveryminutes = String(deliveryData.getMinutes()).padStart(
                2,
                '0'
            );
            // Determinar AM o PM
            let deliveryampm = deliveryhours >= 12 ? 'P' : 'A';
            // Convertir horas de 24 horas a 12 horas
            deliveryhours = deliveryhours % 12;
            deliveryhours = deliveryhours ? deliveryhours : 12; // La hora 0 debería ser 12
            // Formato: YYYY-MM-DD HH:MM AM/PM
            let deliveryformattedDateTime = `${deliveryday}/${deliverymonth}/${deliveryyear}-${deliveryhours}:${deliveryminutes}${deliveryampm}`;

            const createPickUp = async () => {
                let rawData = {
                    status: formData.status,
                    number: formData.number,
                    creation_date: isoDate,
                    creation_date_text: formattedDateTime,
                    pick_up_date_text: pickformattedDateTime,
                    delivery_date_text: deliveryformattedDateTime,
                    pick_up_date: isopickupDate,
                    delivery_date: isodeliveryDate,
                    issued_by: formData.issuedById,
                    destination_agent: formData.destinationAgentId,
                    employee: formData.employeeId,
                    shipper: shipperRequest,
                    shipperType: '',
                    pick_up_location: pickuplocation,
                    consignee: consigneeRequest,
                    delivery_location: deliverylocation,
                    client_to_bill_type: formData.client_to_bill_type,
                    client_to_bill: formData.client_to_bill,

                    pro_number: formData.proNumber,
                    tracking_number: formData.trackingNumber,
                    inland_carrier: formData.inlandCarrierdId,
                    main_carrier: formData.mainCarrierdId,

                    invoice_number: formData.invoiceNumber,
                    purchase_order_number: formData.purchaseOrderNumber,

                    commodities: commodities,
                    charges: charges,
                    supplier:
                        formData.supplierId /* ojo antes era supplier: formData.shipperId, */,
                    weight: weightUpdated,
                    volumen: volumenUpdated,
                };
                const response = await (creating
                    ? PickupService.createPickup(rawData)
                    : PickupService.updatePickup(pickupOrder.id, rawData));

                if (response.status >= 200 && response.status <= 300) {
                    setcurrentPickUpNumber(currentPickUpNumber + 1);
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        closeModal();
                        onpickupOrderDataChange();
                        setShowSuccessAlert(false);
                        setFormData(formFormat);
                        setIsButtonDisabled(false); // Re-habilita el botón después de que la operación ha terminado
                        console.log('Data sent!');
                        window.location.reload();
                        console.log('Data sent! -2');
                    }, 500 /* 2147483647 */);
                } else {
                    setShowErrorAlert(true);
                }
            };
            createPickUp();
        }
    }, [
        shipperRequest,
        deliverylocation,
        pickuplocation,
        consigneeRequest,
        allStateUpdatesComplete,
        clientToBillRequest,
        weightUpdated,
        volumenUpdated,
    ]);
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

    //added save commodities
    useEffect(() => {
        checkUpdatesComplete();
        if (allStateUpdatesComplete) {
            const createPickUp = async () => {
                console.log('shipperRequest', shipperRequest);
                let rawData = {
                    status: 14,
                    number: formData.number,
                    creation_date: formData.createdDateAndTime,
                    issued_by: formData.issuedById,
                    destination_agent: formData.destinationAgentId,
                    employee: formData.employeeId,
                    supplier: formData.supplierId,
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
                };
                const response = await //added for create commdities
                (commodities.length === 0
                    ? Promise.resolve(null)
                    : creating
                      ? Promise.resolve(null) //ReceiptService.createReceipt(rawData) eliminado
                      : (async () => {
                            const buscapick = await PickupService.getPickupById(
                                pickupOrder.id
                            );
                            const buscarecip = (await callrecipt(null)).data
                                .results;

                            //console.log("BUSCARPICKUP", buscarecip);
                            const numeroRecibo = buscapick.data.number;
                            //console.log("numeroRecibo", numeroRecibo);

                            // Verifica si buscapick se ha obtenido correctamente
                            if (
                                buscapick.status >= 200 &&
                                buscapick.status <= 300
                            ) {
                                // Realiza la lógica solo si buscapick se ha obtenido correctamente
                                buscarecip.forEach((pickup) => {
                                    if (pickup.number === numeroRecibo) {
                                        //console.log("HECHO", pickup.number);
                                        ReceiptService.updateReceipt(
                                            pickup.id,
                                            rawData
                                        );
                                    }
                                });
                            } else {
                                console.error('Error al obtener buscapick');
                            }
                        })());

                if (response.status >= 200 && response.status <= 300) {
                    /* if (!creating) {
            const buscapick = await PickupService.getPickupById(pickupOrder.id);
            const buscarecip = (await callrecipt(null)).data.results;

            console.log("BUSCARPICKUP", buscarecip);
            const numeroRecibo = buscapick.data.number;
            console.log("numeroRecibo",numeroRecibo);
            buscarecip.forEach(pickup => {
              if (pickup.number === numeroRecibo) {
                console.log("HECHO",pickup.number);
                //PickupService.updatePickup(pickup.id, rawData);
              }
            }); 
          } */
                    if (fromPickUp) {
                        console.log('BANDERA-1 = ', fromPickUp);
                        //added onhand status
                        const statusOnhand = 4;
                        const newPickup = {
                            ...pickupOrder,
                            status: statusOnhand,
                        };
                        PickupService.updatePickup(pickupOrder.id, newPickup);
                    }

                    if (!fromPickUp) {
                        //added onhand status
                        console.log('BANDERA-2 = ', fromPickUp);
                    }
                    setcurrentPickUpNumber(currentPickUpNumber + 1);
                    setShowSuccessAlert(true);
                    setTimeout(() => {
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
        consigneeRequest,
        allStateUpdatesComplete,
        clientToBillRequest,
    ]);

    const callrecipt = async (url = null) => {
        try {
            return await ReceiptService.getReceipts(url);
        } catch (error) {
            console.error('Error al obtener pedidos de recogida:', error);
            throw error;
        }
    };

    const getAsyncSelectValue = () => {
        let selectedOption = null;
        if (formData.client_to_bill_type === 'shipper') {
            selectedOption = releasedToOptions.find(
                (option) =>
                    option.id === formData.shipperId &&
                    option.type === formData.shipperType
            );
        } else if (formData.client_to_bill_type === 'consignee') {
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
    //--------------------------------------------------
    //added edit commodities
    const handleCommodityEdit = () => {
        console.log('commodities description ', selectedCommodity.description);
        setEditingComodity(true);
        console.log('commodities description ', selectedCommodity);
    };

    //added copy handle
    const handleCopyClickShipper = () => {
        // Obtener la información del shipper
        const shipperValue = defaultValueShipper;
        const shipperInfo = formData.shipperInfo;

        if (shipperValue) {
            // Simular el evento que espera handlePickUp Selection
            const event = {
                id: shipperValue.id,
                type: shipperValue.type,
            };

            // Llamar a handlePickUp Selection con el evento simulado
            handlePickUpSelection(event);

            // Actualizar la información adicional del pickup
            setFormData((prevData) => ({
                ...prevData,
                pickupLocationInfo: shipperInfo,
            }));
        }
    };

    //added copy handle consignee
    const handleCopyClickConsignee = () => {
        // Obtener la información del consignee
        const consigneeValue = defaultValueConsignee;
        const consigneeInfo = formData.consigneeInfo; // Asegúrate de que este campo existe en tu formData

        if (consigneeValue) {
            // Simular el evento que espera handleDeliveryLocationSelection
            const event = {
                id: consigneeValue.id,
                type: consigneeValue.type,
            };

            // Llamar a handleDeliveryLocationSelection con el evento simulado
            handleDeliveryLocationSelection(event);

            // Actualizar la información adicional del delivery location
            setFormData((prevData) => ({
                ...prevData,
                deliveryLocationInfo: consigneeInfo,
            }));
        }
    };

    return (
        <div className="form-container">
            <form className="company-form pickup">
                <div className="row w-100">
                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>General</h2>
                                <span></span>
                            </div>
                            <div className="row align-items-center mb-3">
                                <div className="col-6 text-start text-start">
                                    <Input
                                        id="pickupnumber"
                                        type="number"
                                        inputName="pickupnumber"
                                        placeholder="Pickup Order Number..."
                                        value={formData.number}
                                        readonly={true}
                                        label="Number"
                                    />
                                </div>
                            </div>
                            <div className="row align-items-center mb-3">
                                <div className="col-6 text-start">
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
                                <div className="col-6 text-start" id="dates">
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <p
                                            id="creation-date"
                                            className="text-date"
                                        >
                                            Pick-up Date and Time
                                        </p>
                                        <DateTimePicker
                                            // label="Pick-up Date and Time"
                                            value={dayjs(
                                                formData.pickupDateAndTime
                                            )}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    pickupDateAndTime:
                                                        dayjs(e).format(
                                                            'YYYY-MM-DD hh:mm A'
                                                        ),
                                                })
                                            }
                                            className="creation creation-label"
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="employee"
                                        className="form-label"
                                    >
                                        Employee:
                                    </label>
                                    <AsyncSelect
                                        id="employeeId"
                                        defaultValue={formData.employeeId}
                                        onChange={(e) => {
                                            handleEmployeeSelection(e);
                                        }}
                                        placeholder="Search and select..."
                                        defaultOptions={employeeOptions}
                                        value={employeeOptions.find(
                                            (employee) =>
                                                employee.id ===
                                                formData.employeeId
                                        )}
                                        loadOptions={loadEmployeeSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                    />
                                </div>

                                <div className="col-6 text-start" id="dates">
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <p
                                            id="creation-date"
                                            className="text-date"
                                        >
                                            Delivery Date and Time
                                        </p>
                                        <DateTimePicker
                                            // label="Delivery Date and Time"
                                            value={dayjs(
                                                formData.deliveryDateAndTime
                                            )}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    deliveryDateAndTime:
                                                        dayjs(e).format(
                                                            'YYYY-MM-DD hh:mm A'
                                                        ),
                                                })
                                            }
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>

                            <div className="row mb-2">
                                {/* <div className="" style={{ display: "flex" }}> */}
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
                                            id="destinationAgentId"
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
                                            placeholder="Search and select..."
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
                                            key={destinationAgentOptions.length} // Add esto para que se refresque la lista
                                        />
                                    )}
                                </div>

                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="issuedby"
                                        className="form-label issuedBy"
                                    >
                                        Issued By:
                                    </label>
                                    <AsyncSelect
                                        id="issuedById"
                                        onChange={(e) => {
                                            handleIssuedBySelection(e);
                                        }}
                                        value={issuedByOptions.find(
                                            (issued_by) =>
                                                issued_by.id ===
                                                formData.issuedById
                                        )}
                                        // defaultValue={formData.issuedById}

                                        placeholder="Search and select..."
                                        defaultOptions={issuedByOptions}
                                        loadOptions={loadAgentSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        key={issuedByOptions.length} // Add esto para que se refresque la lista
                                    />

                                    {/* Forms creacion y edicion Agent */}
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
                            {/* </div> */}

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <label
                                        className="copy-label_add"
                                        onClick={handleAddDestinationAgentClick}
                                    >
                                        <i className="fas fa-plus button-icon fa-3x"></i>
                                    </label>
                                    <label
                                        className="copy-label_edit"
                                        onClick={
                                            handleEditDestinationAgentClick
                                        }
                                    >
                                        <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                    </label>
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
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <Input
                                        // id="TextDestinationAgent"
                                        type="textarea"
                                        inputName="AgentInfo"
                                        placeholder="Destination Agent..."
                                        value={formData.destinationAgentInfo}
                                        readonly={true}
                                    />
                                </div>

                                <div className="col-6 text-start">
                                    <div className="company-form__section">
                                        <Input
                                            type="textarea"
                                            inputName="issuedbyinfo"
                                            placeholder="Apply to..."
                                            value={formData.issuedByInfo}
                                            readonly={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>Pickup Information</h2>
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
                                        onChange={(e) => {
                                            handleShipperSelection(e);
                                        }}
                                        value={defaultValueShipper}
                                        placeholder="Search and select..."
                                        defaultOptions={shipperOptions}
                                        loadOptions={loadShipperSelectOptions}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <Input
                                        type="text"
                                        inputName="invoiceNumber"
                                        value={formData.invoiceNumber}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                invoiceNumber: e.target.value,
                                            })
                                        }
                                        label="Purchase Order"
                                    />
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

                            <div className="row mb-3">
                                <div className="col-12 text-start">
                                    <Input
                                        id="TextShipperLocation"
                                        type="textarea"
                                        inputName="shipperinfo"
                                        placeholder="Shipper Location..."
                                        value={formData.shipperInfo}
                                        readonly={true}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-12">
                                    <label
                                        className="copy-label"
                                        onClick={handleCopyClickShipper}
                                    >
                                        Copy To Pickup Location
                                    </label>
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="pickup"
                                        className="form-label"
                                    >
                                        Pick-up Location:
                                    </label>
                                    <AsyncSelect
                                        id="pickupLocation"
                                        onChange={(e) => {
                                            handlePickUpSelection(e);
                                        }}
                                        value={pickupLocationOptions.find(
                                            (option) =>
                                                option.id ===
                                                    formData.pickupLocationId &&
                                                option.type ===
                                                    formData.pickupLocationType
                                        )}
                                        placeholder="Search and select..."
                                        defaultOptions={pickupLocationOptions}
                                        // loadOptions={loadPickUpLocationSelectOptions}
                                        loadOptions={
                                            loadPickUpLocationSelectOpt
                                        }
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        key={pickupLocationOptions.length} // Add esto para que se refresque la lista
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <Input
                                        type="text"
                                        inputName="purchaseOrderNumber"
                                        value={formData.purchaseOrderNumber}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                purchaseOrderNumber:
                                                    e.target.value,
                                            })
                                        }
                                        label="Invoice Number"
                                    />
                                </div>
                                {/* Forms creacion y edicion PickUp Location */}
                                <div>
                                    {isModalOpenPickUpLocation &&
                                        selectedPickUpLocation === null && (
                                            <ModalForm
                                                isOpen={
                                                    isModalOpenPickUpLocation
                                                }
                                                onClose={
                                                    closeModalPickUpLocation
                                                }
                                            >
                                                <CustomerCreationForm
                                                    customer={null}
                                                    closeModal={
                                                        closeModalPickUpLocation
                                                    }
                                                    creating={true}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={(
                                                        createdPickUpLocationId
                                                    ) =>
                                                        handleProcessCompletePickUpLocation(
                                                            createdPickUpLocationId
                                                        )
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>

                                <div>
                                    {isModalOpenPickUpLocation &&
                                        selectedPickUpLocation !== null && (
                                            <ModalForm
                                                isOpen={
                                                    isModalOpenPickUpLocation
                                                }
                                                onClose={
                                                    closeModalPickUpLocation
                                                }
                                            >
                                                <CustomerCreationForm
                                                    customer={
                                                        selectedPickUpLocation
                                                    }
                                                    closeModal={
                                                        closeModalPickUpLocation
                                                    }
                                                    creating={false}
                                                    fromPickupOrder={true}
                                                    onProcessComplete={
                                                        handleProcessCompletePickUpLocation
                                                    }
                                                />
                                            </ModalForm>
                                        )}
                                </div>
                                {/* terminacion de Forms creacion y edicion PickUp Location */}
                            </div>

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <label
                                        className="copy-label_add"
                                        onClick={handleAddPickUpLocationClick}
                                    >
                                        <i className="fas fa-plus button-icon fa-3x"></i>
                                    </label>

                                    <label
                                        className="copy-label_edit"
                                        onClick={handleEditPickUpLocationClick}
                                    >
                                        <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                    </label>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 text-start">
                                    <Input
                                        id="TextPickupLocation"
                                        type="textarea"
                                        inputName="pickupinfo"
                                        placeholder="Pick-up Location..."
                                        readonly={true}
                                        // value={formData.pickupInfo}
                                        value={formData.pickupLocationInfo}
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
                                <h2>Delivery Information</h2>
                                <span></span>
                            </div>
                            <div className="row align-items-center mb-2">
                                <div className="col-6 text-start">
                                    <label
                                        htmlFor="consignee"
                                        className="form-label"
                                    >
                                        Consignee:
                                    </label>
                                    <div className="custom-select">
                                        <AsyncSelect
                                            id="consignee"
                                            onChange={(e) => {
                                                handleConsigneeSelection(e);
                                            }}
                                            value={defaultValueConsignee}
                                            placeholder="Search and select..."
                                            defaultOptions={consigneeOptions}
                                            loadOptions={
                                                loadConsigneeSelectOptions
                                            }
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            getOptionValue={(option) =>
                                                option.id
                                            }
                                        />
                                    </div>

                                    {/* Forms creacion y edicion carrier */}
                                    <div>
                                        {isModalOpenConsignee &&
                                            selectedConsignee === null && (
                                                <ModalForm
                                                    isOpen={
                                                        isModalOpenConsignee
                                                    }
                                                    onClose={
                                                        closeModalConsignee
                                                    }
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
                                                    isOpen={
                                                        isModalOpenConsignee
                                                    }
                                                    onClose={
                                                        closeModalConsignee
                                                    }
                                                >
                                                    <CustomerCreationForm
                                                        customer={
                                                            selectedConsignee
                                                        }
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
                                    {/* terminacion de Forms creacion y edicion shipper */}
                                </div>

                                <div
                                    className="col-6 text-start"
                                    style={{ marginBlockEnd: 'auto' }}
                                >
                                    <label
                                        htmlFor="delivery"
                                        className="form-label"
                                    >
                                        Delivery Location:
                                    </label>
                                    <AsyncSelect
                                        id="deliveryLocation"
                                        onChange={(e) => {
                                            handleDeliveryLocationSelection(e);
                                        }}
                                        value={deliveryLocationOptions.find(
                                            (option) =>
                                                option.id ===
                                                    formData.deliveryLocationId &&
                                                option.type ===
                                                    formData.deliveryLocationType
                                        )}
                                        placeholder="Search and select..."
                                        defaultOptions={deliveryLocationOptions}
                                        // loadOptions={loadDeliveryLocationSelectOptions}
                                        loadOptions={
                                            loadDeliLocationSelectOptions
                                        }
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        key={deliveryLocationOptions.length} // Add esto para que se refresque la lista
                                    />

                                    {/* Forms creacion y edicion customer */}
                                    <div>
                                        {isModalOpenDeliLocation &&
                                            selectedDeliLocation === null && (
                                                <ModalForm
                                                    isOpen={
                                                        isModalOpenDeliLocation
                                                    }
                                                    onClose={
                                                        closeModalDeliLocation
                                                    }
                                                >
                                                    <CustomerCreationForm
                                                        customer={null}
                                                        closeModal={
                                                            closeModalDeliLocation
                                                        }
                                                        creating={true}
                                                        fromPickupOrder={true}
                                                        onProcessComplete={(
                                                            createdDeliLocationId
                                                        ) =>
                                                            handleProcessCompleteDeliLocation(
                                                                createdDeliLocationId
                                                            )
                                                        }
                                                    />
                                                </ModalForm>
                                            )}
                                    </div>

                                    <div>
                                        {isModalOpenDeliLocation &&
                                            selectedDeliLocation !== null && (
                                                <ModalForm
                                                    isOpen={
                                                        isModalOpenDeliLocation
                                                    }
                                                    onClose={
                                                        closeModalDeliLocation
                                                    }
                                                >
                                                    <CustomerCreationForm
                                                        customer={
                                                            selectedDeliLocation
                                                        }
                                                        closeModal={
                                                            closeModalDeliLocation
                                                        }
                                                        creating={false}
                                                        fromPickupOrder={true}
                                                        onProcessComplete={
                                                            handleProcessCompleteDeliLocation
                                                        }
                                                    />
                                                </ModalForm>
                                            )}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
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
                                <div className="col-6 text-start">
                                    <div className="col-6 text-start">
                                        <label
                                            className="copy-label_add"
                                            onClick={handleAddDeliLocationClick}
                                        >
                                            <i className="fas fa-plus button-icon fa-3x"></i>
                                        </label>

                                        <label
                                            className="copy-label_edit"
                                            onClick={
                                                handleEditDeliLocationClick
                                            }
                                        >
                                            <i className="fas fa-pencil-alt button-icon fa-3x ne"></i>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-12">
                                    <label
                                        className="copy-label"
                                        // onClick={handleCopyClickShipper}
                                        onClick={handleCopyClickConsignee}
                                    >
                                        Copy To Delivery Location
                                    </label>
                                </div>
                            </div>

                            <div className="row align-items-center">
                                <div
                                    className="col-6 text-start"
                                    style={{ marginBlockEnd: 'auto' }}
                                >
                                    <div className="text-start">
                                        <label
                                            htmlFor="language"
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '13px',
                                                color: '#565656',
                                                marginRight: '10px',
                                            }}
                                        >
                                            Client to Bill:
                                        </label>
                                        <select
                                            name="clientToBill"
                                            id="clientToBill"
                                            className="form-input"
                                            value={formData.client_to_bill_type}
                                            onChange={(e) => {
                                                handleClientToBillSelection(e);
                                            }}
                                        >
                                            <option value="">
                                                Select an option
                                            </option>
                                            <option value="shipper">
                                                Shipper
                                            </option>
                                            <option value="consignee">
                                                Consignee
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                        <p style={{ color: 'red' }}>
                                            Note: Always select a client to bill
                                            when editing
                                        </p>
                                    </div>
                                    <div className="text-start">
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
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            getOptionValue={(option) =>
                                                option.id
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-6 text-start">
                                    <div className="company-form__section">
                                        <Input
                                            id="TextDeliveryLocation"
                                            type="textarea"
                                            inputName="deliveryInfo"
                                            placeholder="Delivery Info..."
                                            value={
                                                formData.deliveryLocationInfo
                                            }
                                            readonly={true}
                                            label="Address"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row align-items-center"></div> */}
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>Carrier</h2>
                                {/* <span></span> */}
                            </div>
                            <div className="form-label_name">
                                <h4>Inland Carrier</h4>
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

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <Input
                                        id="TextMainCarrier"
                                        type="textarea"
                                        inputName="issuedbydata"
                                        placeholder="Carrier Info..."
                                        value={formData.inlandCarrierdInfo}
                                        readonly={true}
                                        label="Address"
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
                            <div className="form-label_name">
                                <h4>Main Carrier</h4>
                                <span></span>
                            </div>
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
                                        handleMainCarrierSelection(e);
                                    }}
                                    value={carrierOptions.find(
                                        (option) =>
                                            option.id ===
                                            formData.mainCarrierdId
                                    )}
                                    placeholder="Search and select..."
                                    defaultOptions={carrierOptions}
                                    loadOptions={loadCarrierSelectOptions}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* //-------------------------------------COMMODITES------------------------------------------------------------- */}
                <input type="checkbox" id="toggleBoton"></input>
                <label className="button-charge" htmlFor="toggleBoton">
                    Commodities
                </label>

                <div className="row w-100" id="miDiv">
                    {/* <div className=""> */}
                    <div className="creation creation-container w-100">
                        <div className="form-label_name">
                            {editingComodity ? (
                                <h3
                                    style={{
                                        color: 'blue',
                                        fontWeight: 'bold',
                                    }}
                                >
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
                            hideLocation={true}
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
                                        // " Location",
                                        ' Volume (ft3)',
                                        ' Volume-Weight (Vlb)',
                                        // " Weight (lb)",
                                        'Package Type',
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
                                                Weight:{' '}
                                                {selectedCommodity.weight}
                                            </p>
                                            <p className="item-info">
                                                Height:{' '}
                                                {selectedCommodity.height}
                                            </p>
                                            <p className="item-info">
                                                Width: {selectedCommodity.width}
                                            </p>
                                            <p className="item-info">
                                                Length:{' '}
                                                {selectedCommodity.length}
                                            </p>
                                            <p className="item-info">
                                                Volumetric Weight:{' '}
                                                {
                                                    selectedCommodity.volumetricWeight
                                                }
                                            </p>
                                            <p className="item-info">
                                                Chargeable Weight:{' '}
                                                {
                                                    selectedCommodity.chargedWeight
                                                }
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
                                                            {
                                                                com.volumetricWeight
                                                            }
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
                                {/* <button
                    className="button-save"
                    type="button"
                    onClick={() => {
                      setshowRepackingForm(!showRepackingForm);
                    }}
                  >
                    Repack
                  </button> */}
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
                    {/* </div> */}
                </div>

                {/* -------------------------------------------------------------------------------------------------------------- */}

                <input type="checkbox" id="toggleBoton"></input>
                <label
                    className="button-charge"
                    htmlFor="toggleBoton"
                    style={{ display: 'none' }}
                ></label>

                <div className="row w-100" id="miDiv">
                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>Charges Income </h2>
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
                                    data={charges.filter(
                                        (c) => c.type === 'income'
                                    )}
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
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>Charges Expense </h2>
                                <span></span>
                            </div>
                            {true && (
                                <ExpenseChargeForm
                                    onCancel={setshowExpenseForm}
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
                                    data={charges.filter(
                                        (c) => c.type === 'expense'
                                    )}
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
                        </div>
                    </div>
                </div>

                <div className="company-form__options-container">
                    <button
                        className="button-save"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModalConfirm(true);
                            // sendData();
                        }}
                        type="submit"
                    >
                        Save
                    </button>

                    <button className="button-cancel" onClick={closeModal}>
                        Cancel
                    </button>
                </div>
                {showSuccessAlert && (
                    <Alert
                        severity="success"
                        onClose={() => setShowSuccessAlert(false)}
                        className="alert-notification"
                    >
                        <p className="succes"> Success </p>
                        <p className=" created">
                            {' '}
                            Pick up Order {creating
                                ? 'created'
                                : 'updated'}{' '}
                            successfully!{' '}
                        </p>
                    </Alert>
                )}
                {showModalConfirm && (
                    <ConfirmModal
                        title="Confirm"
                        onHide={() => setShowModalConfirm(false)}
                        body={'Are you sure you want to save the changes?'}
                        onConfirm={() => {
                            sendData();
                            setShowModalConfirm(false);
                        }}
                        onCancel={() => setShowModalConfirm(false)}
                    />
                )}
                {showErrorAlert && (
                    <Alert
                        severity="error"
                        onClose={() => setShowErrorAlert(false)}
                        className="alert-notification"
                    >
                        <AlertTitle>Error</AlertTitle>
                        <strong>
                            Error {creating ? 'creating' : 'updating'} Pick up
                            Order. Please try again
                        </strong>
                    </Alert>
                )}
            </form>
        </div>
    );
};

PickupOrderCreationForm.propTypes = {
    pickupOrder: propTypes.object,
    closeModal: propTypes.func,
    creating: propTypes.bool,
    onpickupOrderDataChange: propTypes.func,
};

PickupOrderCreationForm.defaultProps = {
    pickupOrder: {},
    closeModal: null,
    creating: false,
    onpickupOrderDataChange: null,
};

export default PickupOrderCreationForm;
