import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmUserattsService } from "../../service/model/AdmUserattsService";
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

const AdmUseratts = (props) => {
    console.log("PROPS", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admUseratts, setAdmUseratts] = useState(props.admUseratts);
    const [submitted, setSubmitted] = useState(false);
    const [ddAdmUserattsItem, setDdAdmUserattsItem] = useState(null);
    const [ddAdmUserattsItems, setDdAdmUserattsItems] = useState(null);
    const [admUserattsItem, setAdmUserattsItem] = useState(null);
    const [admUserattsItems, setAdmUserattsItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.admUseratts.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.admUseratts.endda ||'99991231' || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.ADM_BACK_URL}/adm/x/useratt/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setAdmUserattsItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdAdmUserattsItems(dataDD);
                setDdAdmUserattsItem(dataDD.find((item) => item.code === props.admUseratts.att) || null);
                if (props.admUseratts.loc) {
                    const foundItem = data.find((item) => item.id === props.admUseratts.att);
                    setAdmUserattsItem(foundItem || null);
                    admUseratts.catt = foundItem.code
                    admUseratts.natt = foundItem.textx
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
            admUseratts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            admUseratts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const admUserattsService = new AdmUserattsService();
            console.log("*****------admUseratts---------******+++*****", admUseratts )
            const data = await admUserattsService.postAdmUseratts(admUseratts);
            admUseratts.id = data
            props.handleDialogClose({ obj: admUseratts, userattsTip: props.userattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "AdmUseratts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            admUseratts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            admUseratts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const admUserattsService = new AdmUserattsService();

            await admUserattsService.putAdmUseratts(admUseratts);
            props.handleDialogClose({ obj: admUseratts, userattsTip: props.userattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "AdmUseratts ",
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
            const admUserattsService = new AdmUserattsService();
            await admUserattsService.deleteAdmUseratts(admUseratts);
            props.handleDialogClose({ obj: admUseratts, userattsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "AdmUseratts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdAdmUserattsItem(e.value);
            const foundItem = admUserattsItems.find((item) => item.id === val);
            setAdmUserattsItem(foundItem || null);
            admUseratts.natt = e.value.name
            admUseratts.catt = foundItem.code
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
        let _admUseratts = { ...admUseratts };
        _admUseratts[`${name}`] = val;
        setAdmUseratts(_admUseratts);
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
                            <label htmlFor="att">{translations[selectedLanguage].Useratts} *</label>
                            <Dropdown id="att"
                                value={ddAdmUserattsItem}
                                options={ddAdmUserattsItems}
                                onChange={(e) => onInputChange(e, "options", 'att')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUseratts.att })}
                            />
                            {submitted && !admUseratts.att && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="vrednost">{translations[selectedLanguage].vrednost}</label>
                            <InputText
                                id="vrednost"
                                value={admUseratts.vrednost}
                                onChange={(e) => onInputChange(e, "text", 'vrednost')}
                            />
                        </div> 
                        <div className="field col-12 md:col-7">
                            <label htmlFor="zzcode">{translations[selectedLanguage].zzcode}</label>
                            <InputText
                                id="zzcode"
                                value={admUseratts.zzcode}
                                onChange={(e) => onInputChange(e, "text", 'zzcode')}
                            />
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
                            {(props.userattsTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userattsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.userattsTip !== 'CREATE') ? (
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
                inAdmUseratts="delete"
                item={admUseratts.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmUseratts;
