import ForwardingAgentService from '../../services/ForwardingAgentService';
import CustomerService from '../../services/CustomerService';
import VendorService from '../../services/VendorService';
import EmployeeService from '../../services/EmployeeService';
import CarrierService from '../../services/CarrierService';

export const fetchFormData = async () => {
  try {
    let forwardingAgentsResults = [];
    let customersResults = [];
    let vendorsResults = [];
    let employeesResults = [];
    let carriersResults = [];

    // Recopilar resultados de Forwarding Agents
    let nextForwardingAgentUrl = null;
    do {
      const response = await ForwardingAgentService.getForwardingAgents(nextForwardingAgentUrl);
      forwardingAgentsResults = [...forwardingAgentsResults, ...response.data.results];
      nextForwardingAgentUrl = response.data.next;
    } while (nextForwardingAgentUrl);


    // Recopilar resultados de Customers
    let nextCustomerUrl = null;
    do {
      const response = await CustomerService.getCustomers(nextCustomerUrl);
      customersResults = [...customersResults, ...response.data.results];
      nextCustomerUrl = response.data.next;
    } while (nextCustomerUrl);


    // Recopilar resultados de Vendors
    let nextVendorUrl = null;
    do {
      const response = await VendorService.getVendors(nextVendorUrl);
      vendorsResults = [...vendorsResults, ...response.data.results];
      nextVendorUrl = response.data.next;
    } while (nextVendorUrl);

    // Recopilar resultados de Employees
    let nextEmployeeUrl = null;
    do {
      const response = await EmployeeService.getEmployees(nextEmployeeUrl);
      employeesResults = [...employeesResults, ...response.data.results];
      nextEmployeeUrl = response.data.next;
    } while (nextEmployeeUrl);


    // Recopilar resultados de Carriers
    let nextCarrierUrl = null;
    do {
      const response = await CarrierService.getCarriers(nextCarrierUrl);
      carriersResults = [...carriersResults, ...response.data.results];
      nextCarrierUrl = response.data.next;
    } while (nextCarrierUrl);


    // Procesar los datos combinados
    const addTypeToObjects = (arr, type) => arr.map(obj => ({ ...obj, type }));

    const forwardingAgentsWithType = addTypeToObjects(forwardingAgentsResults, "forwardingAgent");
    const customersWithType = addTypeToObjects(customersResults, "customer");
    const vendorsWithType = addTypeToObjects(vendorsResults, "vendor");
    const employeesWithType = addTypeToObjects(employeesResults, "employee");
    const carriersWithType = addTypeToObjects(carriersResults, "Carrier");

    const allData = [
      ...forwardingAgentsWithType,
      ...customersWithType,
      ...vendorsWithType,
      ...employeesWithType,
      ...carriersWithType,
    ];

    return allData


  } catch (error) {
    console.error('Error fetching data:', error);
  }
};