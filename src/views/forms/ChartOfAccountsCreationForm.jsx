import { useState, useEffect } from 'react';
import propTypes from 'prop-types'; // Import propTypes from 'prop-types'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Input from '../shared/components/Input';
import ChartOfAccountsService from '../../services/ChartOfAccountsService';
import CurrencyService from '../../services/CurrencyService';
import { fonts } from 'pdfmake/build/pdfmake';

const ChartOfAccountsCreationForm = ({
    chartOfAccounts,
    closeModal,
    creating,
}) => {
    const [activeTab, setActiveTab] = useState('definition');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [ChartOfAccounts, setChartOfAccounts] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [currencies, setcurrencies] = useState([]);

    const formFormat = {
        name: '',
        typeChart: '',
        type: '',
        accountNumber: '',
        parentAccount: '',
        currency: '',
        note: '',
    };

    const [formData, setFormData] = useState({ formFormat });
    // -------------------------------------------------------------
    useEffect(() => {
        if (!creating && chartOfAccounts) {
            setFormData({
                name: chartOfAccounts.name || '',
                typeChart: chartOfAccounts.typeChart || '',
                type: chartOfAccounts.typeChart || '',
                accountNumber: chartOfAccounts.accountNumber || '',
                parentAccount: chartOfAccounts.parentAccount || '',
                currency: chartOfAccounts.currency || '',
                note: chartOfAccounts.note || '',
            });
        }
    }, [creating, chartOfAccounts]);

    useEffect(() => {
        const fetchData = async () => {
            const currenciesData = await CurrencyService.getCurrencies();
            let arr1 = Object.keys(currenciesData.data).filter(
                (c) => c == 'USD' || c == 'COP'
            );
            let arr2 = Object.values(currenciesData.data).filter(
                (c) => c == 'United States Dollar' || c == 'Colombian Peso'
            );
            let combinedArray = [];
            for (let i = 0; i < arr1.length; i++) {
                combinedArray.push([arr1[i], arr2[i]]);
            }
            setcurrencies(combinedArray);
        };

        fetchData();
    }, []);
    // -------------------------------------------------------------

    const sendData = async () => {
        let rawData = {
            name: formData.name,
            typeChart: formData.typeChart,
            type: formData.typeChart,
            accountNumber: formData.accountNumber,
            parentAccount: formData.parentAccount,
            currency: formData.currency,
            note: formData.note,
        };

        const response = await (creating
            ? ChartOfAccountsService.createChartOfAccounts(rawData)
            : ChartOfAccountsService.updateChartOfAccounts(
                  chartOfAccounts.id,
                  rawData
              ));

        if (response.status >= 200 && response.status <= 300) {
            setShowSuccessAlert(true);
            setTimeout(() => {
                closeModal();

                setShowSuccessAlert(false);
                setFormData(formFormat);
                window.location.reload();
            }, 1000);
        } else {
            setShowErrorAlert(true);
        }
    };

    //---------------------------------------------------------------------------------------------------------------------------------------------------

    useEffect(() => {
        const updateChartOfAccounts = (url = null) => {
            ChartOfAccountsService.getChartOfAccounts(url)
                .then((response) => {
                    const newChartOfAccounts = response.data.results.filter(
                        (newChartOfAccount) => {
                            return !ChartOfAccounts.some(
                                (existingChartOfAccount) =>
                                    existingChartOfAccount.id ===
                                    newChartOfAccount.id
                            );
                        }
                    );

                    setChartOfAccounts(
                        [...ChartOfAccounts, ...newChartOfAccounts].reverse()
                    );

                    setAccountype(chartOfAccounts.typeChart);
                    /* if (response.data.next) {} */
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        updateChartOfAccounts();
    }, []);
    const [accountype, setAccountype] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        //setAccountype(chartOfAccounts.parentAccount)
        const handleSearch = (row) => {
            let searchMatch = false;
            console.log('filtrando', row);
            if (row.typeChart === accountype) {
                //se cambia row.type a row.typeChart
                console.log('Hay informacion');
                searchMatch = true;
            } else {
                console.log('No Hay informacion');
            }
            return searchMatch;
        };
        setFilteredData(ChartOfAccounts?.filter((row) => handleSearch(row)));
    }, [ChartOfAccounts, accountype, creating]);
    useEffect(() => {
        setAccountype(chartOfAccounts?.parentAccount);
    }, [chartOfAccounts]);
    const handleType = (type) => {
        setAccountype(type);
        setFormData({ ...formData, type: type, typeChart: type });
    };
    //--------------------------------------------------------------------------------------------------------------------------------------------------
    const handleCancel = () => {
        window.location.reload();
    };

    return (
        <div className="company-form">
           
                <div className="row w-100">
                <div className="col-6">
                <div className="creation creation-container w-100">
                    <div className="form-label_name">
                        <h2>Items & Services</h2>
                        <span></span>
                    </div>

                    <form
                        className={`tab-pane fade ${
                            activeTab === 'definition' ? 'show active' : ''
                        } company-form__general-form`}
                        id="general"
                        style={{
                            display:
                                activeTab === 'definition' ? 'block' : 'none',
                        }}
                    >
                     
                     <div className="row align-items-center mb-2">
                     <div className="col-6 text-start">
                            <div className="company-form__section">
                                <label htmlFor="type" className="form-label">
                                    Type:
                                </label>
                                <select
                                    id="type"
                                    className="form-input"
                                    value={formData.typeChart}
                                    onChange={(e) => handleType(e.target.value)}
                                >
                                    <option value="">Select a Type</option>
                                    <option value="Accounts Receivable">
                                        Accounts Receivable
                                    </option>
                                    <option value="Accouns Payable">
                                        Accouns Payable
                                    </option>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                    <option value="Cost Of Goods Sold<">
                                        Cost Of Goods Sold
                                    </option>
                                    <option value="Bank Account">
                                        Bank Account
                                    </option>
                                    <option value="Undeposited Funds">
                                        Undeposited Funds
                                    </option>
                                    <option value="Fixed Assets">
                                        Fixed Assets
                                    </option>
                                    <option value="Fixed Assets">
                                        Other Assets
                                    </option>
                                    <option value="Other Current Assets">
                                        Other Current Assets
                                    </option>
                                    <option value="Long Term Liabilities">
                                        Long Term Liabilities
                                    </option>
                                    <option value="Other Current Liabilities">
                                        Other Current Liabilities
                                    </option>
                                    <option value="Equity">Equity</option>
                                    <option value="Credit Card">
                                        Credit Card
                                    </option>
                                </select>
                            </div>
                     </div>

                     <div className="col-6 text-start">
                            <div className="company-form__section">
                                <Input
                                    type="text"
                                    inputName="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    changeHandler={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    label="Name"
                                />
                            </div>
                            </div>
                       
                    </div>

                    <div className="row align-items-center mb-2">
                    <div className="col-6 text-start">
                            <div className="company-form__section">
                                <Input
                                    type="num"
                                    inputName="accountNumber"
                                    placeholder="Account Number"
                                    value={formData.accountNumber}
                                    changeHandler={(e) =>
                                        setFormData({
                                            ...formData,
                                            accountNumber: e.target.value,
                                        })
                                    }
                                    label="Account Number"
                                />
                            </div>
                    </div>

                    <div className="col-6 text-start">
                            <div className="company-form__section">
                                <label
                                    htmlFor="chartofaccountsType"
                                    className="form-label"
                                >
                                    Parent Account:
                                </label>
                                <select
                                    id="parentAccount"
                                    className="form-input"
                                    value={
                                        formData.parentAccount
                                            ? formData.parentAccount
                                            : ''
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            parentAccount: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">
                                        Select a Parent Account
                                    </option>
                                    {filteredData?.map((ChartOfAccounts) => (
                                        <option
                                            key={ChartOfAccounts.id}
                                            value={
                                                ChartOfAccounts.name +
                                                ' || ' +
                                                ChartOfAccounts.typeChart
                                            }
                                            data-key={ChartOfAccounts.typeChart}
                                        >
                                            {ChartOfAccounts.name +
                                                ' || ' +
                                                ChartOfAccounts.typeChart}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            </div>
                    </div>

                    <div className="row align-items-center mb-3">
                    <div className="col-6 text-start">
                        <div className="company-form__section" style={{marginBottom: '4vw'}}>
                                    <label
                                        htmlFor="currency"
                                        className="form-label"
                                    >
                                        Currency:
                                    </label>
                                    <select
                                        id="currency"
                                        className="form-input"
                                        value={formData.currency}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                currency: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Select a currency
                                        </option>
                                        {currencies?.map((currency) => {
                                            return (
                                                <option
                                                    key={currency[0]}
                                                    value={
                                                        currency[0] +
                                                        ' ' +
                                                        currency[1]
                                                    }
                                                    data-key={currency[1]}
                                                >
                                                    {currency[0] +
                                                        ' ' +
                                                        currency[1]}
                                                </option>
                                            );
                                        })}
                                    </select>
                        </div>
                        </div>
                           
                        <div className="col-6 text-start">
                        <div className="form-group">
                            <Input
                                type="textarea"
                                inputName="note"
                                placeholder="Nota here..."
                                label="Note"
                                value={formData.note}
                                changeHandler={(e) =>
                                    setFormData({
                                        ...formData,
                                        note: e.target.value,
                                    })
                                }
                            />
                        </div>
                        </div>
                    </div>
                    </form>
                </div>
                </div>
            </div>

            <div className="company-form__options-container">
                <button className="button-save" onClick={sendData}>
                    Save
                </button>
                <button className="button-cancel" onClick={handleCancel}>
                    Cancel
                </button>
            </div>
            {/* Conditionally render the success alert */}
            {showSuccessAlert && (
                <Alert
                    severity="success"
                    onClose={() => setShowSuccessAlert(false)}
                    className="alert-notification"
                >
                    {/* <AlertTitle>Success</AlertTitle> */}
                    <p className="succes"> Success </p>
                    <p className=" created">
                        {' '}
                        Chart Of Accounts {creating
                            ? 'created'
                            : 'updated'}{' '}
                        successfully!{' '}
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
                        Error {creating ? 'creating' : 'updating'} Chart Of
                        Accounts. Please try again
                    </strong>
                </Alert>
            )}
        </div>
    );
};

ChartOfAccountsCreationForm.propTypes = {
    chartOfAccounts: propTypes.object,
    closeModal: propTypes.func,
    creating: propTypes.bool.isRequired,
    onChartOfAccountsDataChange: propTypes.func,
};

ChartOfAccountsCreationForm.defaultProps = {
    chartOfAccounts: {},
    closeModal: null,
    creating: false,
    onChartOfAccountsDataChange: null,
};

export default ChartOfAccountsCreationForm;
