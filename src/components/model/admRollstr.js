import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmRollactService } from "../../service/model/AdmRollactService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from "primereact/inputswitch";
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const AdmRollact = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admRollstr, setAdmRollact] = useState(props.admRollstr);
    const [submitted, setSubmitted] = useState(false);
    const [ddObjtp, setDdObjtp] = useState(null);
    const [ddObjtps, setDdObjtps] = useState(null);
    const [ddObj, setDdObj] = useState(null);
    const [ddObjs, setDdObjs] = useState(null);
    const [onoff, setOnoff] = useState(props.admRollstr.onoff == 1);
    const [hijerarhija, setHijerarhija] = useState(props.admRollstr.hijerarhija == 1);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/objtp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObjtps(dataDD);
                setDdObjtp(dataDD.find((item) => item.roll === props.admRollstr.objtp) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const tp = admRollstr.tp||-1
                const url = `${env.CMN_BACK_URL}/cmn/x/obj/getall/tp/${tp}/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                console.log(response.data.items, '*-*-*-*-*-')
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObjs(dataDD);
                setDdObj(dataDD.find((item) => item.roll === props.admRollstr.obj) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [admRollstr.tp]);    

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            admRollstr.onoff = onoff ? 1 : null;
            admRollstr.hijerarhija = hijerarhija ? 1 : null;
            const admRollstrService = new AdmRollactService();
            const dataId = await admRollstrService.postAdmRollAct(admRollstr);
            admRollstr.id = dataId
            props.handleDialogClose({ obj: admRollstr, rollactTip: props.rollactTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            admRollstr.onoff = onoff ? 1 : null;
            admRollstr.hijerarhija = hijerarhija ? 1 : null;
            const admRollstrService = new AdmRollactService();
            await admRollstrService.putAdmRollAct(admRollstr);
            props.handleDialogClose({ obj: admRollstr, rollactTip: props.rollactTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
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
            const admRollstrService = new AdmRollactService();
            await admRollstrService.deleteAdmRollAct(admRollstr);
            props.handleDialogClose({ obj: admRollstr, rollactTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            setDdObjtp(e.value);
            switch (name) {
                case "onoff":
                    admRollstr.otext = e.value.name
                    admRollstr.ocode = e.value.code
                    break;
                case "hijerarhija":
                    admRollstr.o1text = e.value.name
                    admRollstr.o2code = e.value.code
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }            
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "inputSwitch") {
            val = (e.target && e.target.value) ? 1 : null
            switch (name) {
                case "onoff":
                    setOnoff(e.value)
                    break;
                case "hijerarhija":
                    setHijerarhija(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admRollstr = { ...admRollstr };
        _admRollstr[`${name}`] = val;

        setAdmRollact(_admRollstr);
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
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code"
                                value={props.admRoll.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={props.admRoll.textx}
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
                            <label htmlFor="objtp">{translations[selectedLanguage].ObjtpText} *</label>
                            <Dropdown id="objtp"
                                value={ddObjtp}
                                options={ddObjtps}
                                onChange={(e) => onInputChange(e, "options", 'objtp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRollstr.objtp })}
                            />
                            {submitted && !admRollstr.objtp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="obj">{translations[selectedLanguage].ObjText} *</label>
                            <Dropdown id="ob"
                                value={ddObj}
                                options={ddObjs}
                                onChange={(e) => onInputChange(e, "options", 'obj')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRollstr.obj })}
                            />
                            {submitted && !admRollstr.obj && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                    </div>

                    <div className="flex flex-wrap gap-1">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Creation}</label>
                                <InputSwitch inputId="onoff" checked={onoff} onChange={(e) => onInputChange(e, "inputSwitch", 'onoff')} />
                            </div>
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Updation}</label>
                                <InputSwitch inputId="hijerarhija" checked={hijerarhija} onChange={(e) => onInputChange(e, "inputSwitch", 'hijerarhija')} />
                            </div>
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
                            {(props.rollactTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.rollactTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.rollactTip !== 'CREATE') ? (
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
                inAction="delete"
                item={admRollstr.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmRollact;
