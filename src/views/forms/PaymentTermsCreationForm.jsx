import { useState, useEffect } from 'react';
import propTypes from 'prop-types'; // Import propTypes from 'prop-types'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Input from '../shared/components/Input';
import PaymentTermsService from '../../services/PaymentTermsService';

const PaymentTermsCreationForms = ({ paymentTerms, closeModal, creating }) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [PaymentTerms, setPaymentTerms] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const formFormat = {
        description: '',
        dueDays: '',
        discountPercentage: '',
        discountDays: '',
        inactive: false,
    };

    const [formData, setFormData] = useState({ formFormat });

    useEffect(() => {
        if (!creating && paymentTerms) {
            setFormData({
                description: paymentTerms.description || '',
                dueDays: paymentTerms.dueDays || '',
                discountPercentage: paymentTerms.discountPercentage || '',
                discountDays: paymentTerms.discountDays || '',
                inactive: paymentTerms.inactive || false,
            });
        }
    }, [creating, paymentTerms]);

    const sendData = async () => {
        let rawData = {
            description: formData.description || '',
            dueDays: formData.dueDays || '',
            discountPercentage: formData.discountPercentage || '',
            discountDays: formData.discountDays || '',
            inactive: formData.inactive || false,
        };

        //-------------------------------------

        const response = await (creating
            ? PaymentTermsService.createPaymentTerm(rawData)
            : PaymentTermsService.updatePaymentTerm(paymentTerms.id, rawData));
        //
        //

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

    const updatePaymentTerm = (url = null) => {
        PaymentTermsService.getPaymentTerms(url)
            .then((response) => {
                const newPaymentTerms = response.data.results.filter(
                    (newPaymentTerm) => {
                        return !PaymentTerms.some(
                            (existingPaymentTerm) =>
                                existingPaymentTerm.id === newPaymentTerm.id
                        );
                    }
                );

                setPaymentTerms(
                    [...PaymentTerms, ...newPaymentTerms].reverse()
                );

                if (response.data.next) {
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        updatePaymentTerm();
    }, []);

    const handleCancel = () => {
        window.location.reload();
    };

    return (
        <div className="company-form">
            <div className="creation creation-container w-100">
                <div className="row w-100">
                    <div className="form-label_name">
                        <h2>Payment Terms</h2>
                        <span></span>
                    </div>

                    <div className="col-6 text-start">
                        <div className="company-form__section">
                            <Input
                                type="text"
                                inputName="description"
                                placeholder="Description"
                                value={formData.description}
                                changeHandler={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                label="Description"
                            />
                        </div>
                        <div className="company-form__section">
                            <Input
                                type="number"
                                inputName="dueDays"
                                placeholder="Due Days"
                                value={formData.dueDays}
                                changeHandler={(e) =>
                                    setFormData({
                                        ...formData,
                                        dueDays: e.target.value,
                                    })
                                }
                                label="Due Days"
                            />
                        </div>
                        <div className="company-form__section">
                            <Input
                                type="number"
                                inputName="discountPercentage"
                                placeholder="Discount Pe"
                                value={formData.discountPercentage}
                                changeHandler={(e) =>
                                    setFormData({
                                        ...formData,
                                        discountPercentage: e.target.value,
                                    })
                                }
                                label="Discount Percentage"
                            />
                        </div>
                    </div>

                    <div className="col-6 text-start">
                        <div className="company-form__section">
                            <Input
                                type="number"
                                inputName="discountDays"
                                placeholder="Discount Da"
                                value={formData.discountDays}
                                changeHandler={(e) =>
                                    setFormData({
                                        ...formData,
                                        discountDays: e.target.value,
                                    })
                                }
                                label="Discount Days"
                            />
                        </div>
                        <div className="company-form__section">
                            <Input
                                type="checkbox"
                                inputName="inactive"
                                value={formData.inactive}
                                changeHandler={(e) =>
                                    setFormData({
                                        ...formData,
                                        inactive: e.target.value,
                                    })
                                }
                                label="Inactive"
                            />
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
                        Payment Terms {creating ? 'created' : 'updated'}{' '}
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
                        Error {creating ? 'creating' : 'updating'} Payment
                        Terms. Please try again
                    </strong>
                </Alert>
            )}
        </div>
    );
};

PaymentTermsCreationForms.propTypes = {
    paymentTerms: propTypes.object,
    closeModal: propTypes.func,
    creating: propTypes.bool.isRequired,
    onpaymentTermDataChange: propTypes.func,
};

PaymentTermsCreationForms.defaultProps = {
    paymentTerms: {},
    closeModal: null,
    creating: false,
    onpaymentTermDataChange: null,
};

export default PaymentTermsCreationForms;
