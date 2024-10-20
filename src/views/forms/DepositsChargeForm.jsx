import { useState, useEffect } from 'react';
import propTypes from 'prop-types'; // Import propTypes from 'prop-types'
import '../../styles/components/IncomeChargeForm.css';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Input from '../shared/components/Input';
import AsyncSelect from 'react-select/async';
import ChartOfAccountsService from '../../services/ChartOfAccountsService';
import CustomerService from '../../services/CustomerService';

const DepositsChargeForm = ({
    onCancel,
    deposits,
    setdeposits,
    editing,
    deposit,
}) => {
    const formFormat = {
        accountByName: '',
        amount: '',
        description: '',
        entity: '',
        accountById: '',
        account: '',
        deposit: '',
    };

    const [types, settype] = useState([]);
    const [accounts, setaccounts] = useState([]);
    const [resultado, setResultado] = useState(0);

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [total, settotal] = useState(0);

    const [formData, setformData] = useState(formFormat);
    const [accountByOptions, setaccountByOptions] = useState(formFormat);
    const [accountByName, setaccountByName] = useState([]);
    const [accountById, setaccountByType] = useState([]);
    const [entity, setentityByName] = useState([]);
    const [customeByOptions, setcustomeByOptions] = useState(formFormat);
    const [internalID, setinternalID] = useState(0);
    // --------------------------------------------------------------------------------

    const addCommodity = () => {
        const suma = parseInt(formData.amount) + parseInt(resultado);
        setResultado(suma);
        setformData({ ...formData, suma: formData.suma });
        const body = {
            id: internalID,
            accountByName: formData.accountByName,
            accountByType: formData.accountByType,
            amount: formData.amount,
            description: formData.description,
            entity: formData.entity,
        };
        if (editing) {
            const indexToEdit = deposits.findIndex(
                (comm) => comm.id == deposit.id
            );
            const copy = [...deposits];
            copy[indexToEdit] = body;
            setdeposits(copy);
        } else {
            setdeposits([...deposits, body]);
            setinternalID(internalID + 1);
        }
    };

    useEffect(() => {
        if (formData.height && formData.width && formData.length) {
            const volWeight = (
                (formData.height * formData.width * formData.length) /
                166
            ).toFixed(0);
            const ratedWeight =
                formData.volumetricWeight >= formData.weight
                    ? formData.volumetricWeight
                    : formData.weight;
            setformData({
                ...formData,
                volumetricWeight: volWeight,
                chargedWeight: ratedWeight,
            });
        }
    }, [formData.height, formData.length, formData.width]);

    useEffect(() => {
        if (editing) {
            const formFormat = {
                id: deposit.id,
                accountByName: deposit.accountByName,
                description: deposit.description,
                accountByType: deposit.accountByType,
                amount: deposit.amount,
                total: total,
                entity: deposit.entity,
                resultado: deposit.resultado,
            };
            setformData(formFormat);
        }
    }, []);

    const sendDataType = async () => {
        let rawData = {
            accountByName: formData.accountByName,
            accountByType: formData.accountByType,
            entity: formData.entity,
        };
        const response = await (creating
            ? ChartOfAccountsService.createChartOfAccounts(rawData)
            : ChartOfAccountsService.updateChartOfAccounts(deposit.id, rawData)
              ? CustomerService.CustomerService(rawData)
              : CustomerService.updateCustomer(deposit.id, rawData));

        if (response.status >= 200 && response.status <= 300) {
            setShowSuccessAlert(true);
            setTimeout(() => {
                closeModal();
                onInvoicesDataChange();
                setShowSuccessAlert(false);
                // window.location.reload();
            }, 1000);
        } else {
            setShowErrorAlert(true);
        }
    };

    const fetchFormData = async () => {
        const accoun = (await ChartOfAccountsService.getChartOfAccounts()).data
            .results;
        const customer = (await CustomerService.getCustomers()).data.results;
        // Function to add 'type' property to an array of objects
        const addTypeToObjects = (arr, type) =>
            arr.map((obj) => ({ ...obj, type }));
        const addCustomerToObjects = (arr, type) =>
            arr.map((obj) => ({ ...obj, type }));

        // Add 'type' property to each array
        const accountWithType = addTypeToObjects(accoun, 'accoun');
        const customeWithType = addCustomerToObjects(
            customer,
            'customer-chart'
        );

        // Merge the arrays
        // const accountByOptions = [...accountWithType].filter(account => (account.type == "Expense") || (account.type == "Equity") || (account.type == "Accouns Payable"));
        const accountByOptions = [...accountWithType];

        const customeByOptions = [...customeWithType];

        setaccountByOptions(accountByOptions);
        setcustomeByOptions(customeByOptions);
    };

    useEffect(() => {
        fetchFormData();
    }, []);

    //------------------------------------------------------------------------------------
    const handleAccountBySelection = async (event) => {
        const id = event.id;
        const type = event.type;
        const name = event.name;
        const result = await ChartOfAccountsService.getChartOfAccountsId(id);
        setaccounts(result.data);
        setformData({
            ...formData,
            accountById: id,
            accountByType: type,
            accountByName: name,
        });
    };
    //------------------------------------------------------------------------------------
    const handleEntityBySelection = async (event) => {
        const id = event.id;
        const name = event.name;
        const result = await CustomerService.getCustomerById(id);
        settype(result.data);
        setformData({
            ...formData,
            customerById: id,
            entity: name,
        });
    };

    return (
        <div className="company-form row income-charge-form">
            <h3>Deposit Creation Form</h3>
            <div className="row w-100">
                <div className="col-6">
                    <div className="company-form__section">
                        <label htmlFor="account" className="form-label">
                            Account Name:
                        </label>
                        <AsyncSelect
                            id="account"
                            value={accountByName.find(
                                (option) => option.id === formData.accountByName
                            )}
                            onChange={(e) => {
                                handleAccountBySelection(e);
                            }}
                            isClearable={true}
                            placeholder="Search and select..."
                            defaultOptions={accountByOptions}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                        />
                    </div>
                    {/* --------------------------------------------------------------------------- */}
                    <div className="company-form__section">
                        <Input
                            type="number"
                            inputName="amount"
                            placeholder="amount"
                            value={formData.amount}
                            changeHandler={(e) =>
                                setformData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            label="Amount"
                        />
                    </div>
                    {/* ---------------------------------------------------------------------------- */}

                    <div className="company-form__section">
                        <Input
                            type="text"
                            inputName="description"
                            placeholder="description"
                            value={formData.description}
                            changeHandler={(e) =>
                                setformData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            label="Description"
                        />
                    </div>
                    {/* ---------------------------------------------------------------------------- */}
                    <div className="company-form__section">
                        <label htmlFor="customerByCode" className="form-label">
                            Entity:
                        </label>
                        <AsyncSelect
                            id="customerByCode"
                            value={entity.find(
                                (option) => option.id === formData.entity
                            )}
                            onChange={(e) => {
                                handleEntityBySelection(e);
                            }}
                            isClearable={true}
                            placeholder="Search and select..."
                            defaultOptions={customeByOptions}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                        />
                    </div>
                    {/* --------------------------------------------- */}
                </div>

                <div className="table-hover charge-buttons">
                    <button
                        className="button-save pick "
                        style={{ marginRight: '10px' }}
                        type="button"
                        onClick={addCommodity}
                    >
                        <i className="fas fa-check-circle"></i>
                    </button>
                    <button
                        className="button-cancel pick "
                        type="button"
                        onClick={() => onCancel(false)}
                    >
                        <i className="fas fa-times-circle"></i>
                    </button>
                </div>
            </div>
            {showSuccessAlert && (
                <Alert
                    severity="success"
                    onClose={() => setShowSuccessAlert(false)}
                    className="alert-notification"
                >
                    <AlertTitle>Success</AlertTitle>
                    <strong>Commodity created successfully!</strong>
                </Alert>
            )}
            {showErrorAlert && (
                <Alert
                    severity="error"
                    onClose={() => setShowErrorAlert(false)}
                    className="alert-notification"
                >
                    <AlertTitle>Error</AlertTitle>
                    <strong>Error creating Commodity. Please try again</strong>
                </Alert>
            )}
        </div>
    );
};

DepositsChargeForm.propTypes = {
    onCancel: propTypes.func,
    deposits: propTypes.array,
};

DepositsChargeForm.defaultProps = {
    onCancel: null,
    deposits: [],
};

export default DepositsChargeForm;
