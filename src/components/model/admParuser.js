import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmParuserService } from "../../service/model/AdmParuserService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const AdmParuser = (props) => {
    console.log("PROPS", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admParuser, setAdmParuser] = useState(props.admParuser);
    const [submitted, setSubmitted] = useState(false);
    const [ddAdmParuserItem, setDdAdmParuserItem] = useState(null);
    const [ddAdmParuserItems, setDdAdmParuserItems] = useState(null);
    const [admParuserItem, setAdmParuserItem] = useState(null);
    const [admParuserItems, setAdmParuserItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.admParuser.begda )));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.admParuser.endda )))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/par/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setAdmParuserItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdAdmParuserItems(dataDD);
                setDdAdmParuserItem(dataDD.find((item) => item.code === props.admParuser.par) || null);
                if (props.admParuser.loc) {
                    const foundItem = data.find((item) => item.id === props.admParuser.par);
                    setAdmParuserItem(foundItem || null);
                    admParuser.cpar = foundItem.code
                    admParuser.npar = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            admParuser.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            admParuser.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const admParuserService = new AdmParuserService();
            console.log("*****------admParuser---------******+++*****", admParuserService )
            const data = await admParuserService.postAdmParuser(admParuser);
            admParuser.id = data
            props.handleDialogClose({ obj: admParuser, paruserTip: props.paruserTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "AdmParuser ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            admParuser.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            admParuser.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const admParuserService = new AdmParuserService();

            await admParuserService.putAdmParuser(admParuser);
            props.handleDialogClose({ obj: admParuser, paruserTip: props.paruserTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "AdmParuser ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const admParuserService = new AdmParuserService();
            await admParuserService.deleteAdmParuser(admParuser);
            props.handleDialogClose({ obj: admParuser, paruserTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "AdmParuser ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdAdmParuserItem(e.value);
            const foundItem = admParuserItems.find((item) => item.id === val);
            setAdmParuserItem(foundItem || null);
            admParuser.npar = e.value.name
            admParuser.cpar = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    break;
                case "endda":
                    setEndda(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _admParuser = { ...admParuser };
        _admParuser[`${name}`] = val;
        setAdmParuser(_admParuser);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="gtext">{translations[selectedLanguage].Username}</label>
                            <InputText id="gtext"
                                value={props.admUser.gtext}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="mail">{translations[selectedLanguage].Mail}</label>
                            <InputText
                                id="mail"
                                value={props.admUser.mail}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="par">{translations[selectedLanguage].Partner} *</label>
                            <Dropdown id="par"
                                value={ddAdmParuserItem}
                                options={ddAdmParuserItems}
                                onChange={(e) => onInputChange(e, "options", 'par')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admParuser.par })}
                            />
                            {submitted && !admParuser.par && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />

                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label={translations[selectedLanguage].Cancel}
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                outlined
                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.paruserTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.paruserTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.paruserTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAdmParuser="delete"
                item={admParuser.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmParuser;
