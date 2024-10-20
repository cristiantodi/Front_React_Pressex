import { useState, useEffect } from 'react';
import propTypes from 'prop-types'; // Import propTypes from 'prop-types'
import PortServices from '../../services/PortServices';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CountriesService from '../../services/CountriesService'; // Adjust the path as needed
import Input from '../shared/components/Input';
const PortsCreationForm = ({
    port,
    closeModal,
    creating,
    onPortDataChange,
}) => {
    const [activeTab, setActiveTab] = useState('port');
    const [countries, setCountries] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        maritime: '',
        country: '',
        sub_division: '',
        used: false,
        us_customs_code: '',
        rail: false,
        road: false,
        // maritime: false,
        air: false,
        mail: false,
        borderCrossing: false,
    });

    const handleCountryChange = (event) => {
        setFormData({ ...formData, country: event.target.value });
    };

    const handleMethodSelection = (option) => {
        const updatedFormData = { ...formData };
        updatedFormData[option] = true;
        setFormData(updatedFormData);
    };

    useEffect(() => {
        if (!creating && port) {
            setFormData({
                name: port.name || '',
                code: port.code || '',
                maritime: port.maritime || '',
                country: port.country || '',
                sub_division: port.sub_division || '',
                used: port.used || '',
                us_customs_code: port.us_customs_code || '',
                rail: port.rail || false,
                road: port.road || false,
                // maritime: port.maritime || false,
                air: port.air || false,
                mail: port.mail || false,
                borderCrossing: port.borderCrossing || false,
            });
        }
    }, [creating, port]);

    useEffect(() => {
        const fetchData = async () => {
            const countriesData = await CountriesService.fetchCountries();
            setCountries(countriesData.data);
        };

        fetchData();
    }, []);

    const sendData = async () => {
        let rawData = {
            name: formData.name,
            code: formData.code,
            maritime: formData.maritime,
            country: formData.country,
            sub_division: formData.sub_division,
            used: formData.used,
            us_customs_code: formData.us_customs_code,
            rail: formData.rail,
            road: formData.road,
            // maritime: formData.maritime,
            air: formData.air,
            mail: formData.mail,
            borderCrossing: formData.borderCrossing,
        };

        const response = await (creating
            ? PortServices.createPort(rawData)
            : PortServices.updatePort(port.id, rawData));

        if (response.status >= 200 && response.status <= 300) {
            setShowSuccessAlert(true);
            setTimeout(() => {
                closeModal();
                onPortDataChange();
                setShowSuccessAlert(false);
                window.location.reload();
            }, 1000);
        } else {
            setShowErrorAlert(true);
        }
    };

    const handleCancel = () => {
        window.location.reload();
    };

    return (
        <div className="form-container">
            <div className="company-form">
                <div className="row w-100">
                    <div className="col-6 text-start">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>General</h2>
                                <span></span>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <div className="company-form__section">
                                        <label
                                            htmlFor="wp-country"
                                            className="form-label"
                                        >
                                            Country
                                        </label>
                                        <select
                                            name="wp-country"
                                            id="wp-country"
                                            className="form-input"
                                            value={formData.country}
                                            onChange={(e) =>
                                                handleCountryChange(e)
                                            }
                                        >
                                            <option value="">
                                                Select a country
                                            </option>
                                            {formData.country &&
                                                countries
                                                    .filter(
                                                        (country) =>
                                                            country.name ===
                                                            formData.country
                                                    )
                                                    .map((country) => (
                                                        <option
                                                            key={country.iso2}
                                                            value={country.name}
                                                            data-key={
                                                                country.iso2
                                                            }
                                                        >
                                                            {country.name}
                                                        </option>
                                                    ))}
                                            {!formData.city &&
                                                countries.map((country) => (
                                                    <option
                                                        key={country.iso2}
                                                        value={country.name}
                                                        data-key={country.iso2}
                                                    >
                                                        {country.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-6 text-start">
                                    <div className="company-form__section">
                                        <Input
                                            type="text"
                                            inputName="portid"
                                            placeholder="Port ID..."
                                            value={formData.code}
                                            changeHandler={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    code: e.target.value,
                                                })
                                            }
                                            label="Port ID"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6 text-start">
                                    <div className="company-form__section">
                                        <Input
                                            type="text"
                                            inputName="portname"
                                            placeholder="Port Name..."
                                            value={formData.name}
                                            changeHandler={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            label="Port Name"
                                        />
                                    </div>
                                </div>

                                <div className="col-6 text-start">
                                    <div className="company-form__section">
                                        <Input
                                            type="text"
                                            inputName="sub_division"
                                            placeholder="Subdivision..."
                                            value={formData.sub_division}
                                            changeHandler={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    sub_division:
                                                        e.target.value,
                                                })
                                            }
                                            label="Subdivision"
                                        />
                                    </div>
                                </div>
                            </div>

                            <label className="form-label">
                                Transportation method
                            </label>
                            <div className="method">
                                <div className="checkbox_container">
                                    <Input
                                        type="checkbox"
                                        inputName="maritime"
                                        value={formData.maritime}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                maritime: e.target.checked,
                                            })
                                        }
                                        label="Maritime"
                                    />
                                    <Input
                                        type="checkbox"
                                        inputName="rail"
                                        value={formData.rail}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                rail: e.target.checked,
                                            })
                                        }
                                        label="Rail"
                                    />
                                    <Input
                                        type="checkbox"
                                        inputName="road"
                                        value={formData.road}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                road: e.target.value,
                                            })
                                        }
                                        label="Road"
                                    />
                                    <Input
                                        type="checkbox"
                                        inputName="air"
                                        value={formData.air}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                air: e.target.value,
                                            })
                                        }
                                        label="Air"
                                    />
                                    <Input
                                        type="checkbox"
                                        inputName="mail"
                                        value={formData.mail}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail: e.target.value,
                                            })
                                        }
                                        label="Mail"
                                    />
                                    <Input
                                        type="checkbox"
                                        inputName="borderCrossing"
                                        value={formData.borderCrossing}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                borderCrossing: e.target.value,
                                            })
                                        }
                                        label="Border Crossing Point"
                                    />
                                </div>
                            </div>

                            <div className="check-port">
                                <Input
                                    type="checkbox"
                                    inputName="usedbycompany"
                                    value={formData.used}
                                    changeHandler={(e) =>
                                        setFormData({
                                            ...formData,
                                            used: e.target.checked,
                                        })
                                    }
                                    label="This port is used by my company"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-6 text-start">
                        <div className="creation creation-container w-100">
                            <div className="form-label_name">
                                <h2>Address</h2>
                                <span></span>
                            </div>
                            <div>
                                <div className="company-form__section">
                                    <Input
                                        type="textarea"
                                        inputName="us_customs_code"
                                        placeholder="US Custom Codes..."
                                        value={formData.us_customs_code}
                                        changeHandler={(e) =>
                                            setFormData({
                                                ...formData,
                                                us_customs_code: e.target.value,
                                            })
                                        }
                                        label="US Custom Codes"
                                    />
                                </div>
                            </div>
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
                        <AlertTitle>Success</AlertTitle>
                        <strong>
                            Port {creating ? 'created' : 'updated'}{' '}
                            successfully!
                        </strong>
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
                            Error {creating ? 'creating' : 'updating'} Port.
                            Please try again
                        </strong>
                    </Alert>
                )}
            </div>
        </div>
    );
};

PortsCreationForm.propTypes = {
    port: propTypes.object,
    closeModal: propTypes.func,
    creating: propTypes.bool.isRequired,
    onPortDataChange: propTypes.func,
};

PortsCreationForm.defaultProps = {
    port: {},
    closeModal: null,
    creating: false,
    onPortDataChange: null,
};

export default PortsCreationForm;
