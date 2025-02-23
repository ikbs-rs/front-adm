import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Toast } from 'primereact/toast';
import { AdmUserattsService } from '../../service/model/AdmUserattsService';
import { CmnParService } from '../../service/model/CmnParService';
import AdmUseratts from './admUseratts';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';
// import CmnPar from './cmnPar';
import env from '../../configs/env';

export default function AdmUserattsL(props) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const objName = 'adm_useratts';
    // const parDetail = `${env.CMN_URL}?endpoint=parend&sl=${selectedLanguage}`;
    const messageDomen = `${env.DOMEN}`;
    const emptyAdmUseratts = EmptyEntities[objName];
    emptyAdmUseratts.usr = props.admUser.id;
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [admUserattss, setAdmUserattss] = useState([]);
    const [admUseratts, setAdmUseratts] = useState(emptyAdmUseratts);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [userattsTip, setUserattsTip] = useState('');
    // const [parTip, setParTip] = useState('');
    // const [cmnParVisible, setCmnParVisible] = useState(false);
    // const [cmnPar, setCmnPar] = useState(null);
    let i = 0;
    const handleCancelClick = () => {
        props.setAdmUserattsLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const admUserattsService = new AdmUserattsService();
                    const data = await admUserattsService.getLista(props.admUser.id);
                    console.log('LOCATION podaci', data);
                    setAdmUserattss(data);

                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _admUserattss = [...admUserattss];
        let _admUseratts = { ...localObj.newObj.obj };
        //setSubmitted(true);
        if (localObj.newObj.userattsTip === 'CREATE') {
            _admUserattss.push(_admUseratts);
        } else if (localObj.newObj.userattsTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _admUserattss[index] = _admUseratts;
        } else if (localObj.newObj.userattsTip === 'DELETE') {
            _admUserattss = admUserattss.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUseratts Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUseratts ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.userattsTip}`, life: 3000 });
        setAdmUserattss(_admUserattss);
        setAdmUseratts(emptyAdmUseratts);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < admUserattss.length; i++) {
            if (admUserattss[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // const handleCmnParDialogClose = (newObj) => {
    //     setCmnPar(newObj);
    //     setCmnParVisible(false);
    // };

    const openNew = () => {
        setAdmUserattsDialog(emptyAdmUseratts);
    };

    const onRowSelect = (event) => {
        //admUseratts.begda = event.data.begda
        toast.current.show({
            severity: 'info',
            summary: 'Action Selected',
            detail: `Id: ${event.data.id} Name: ${event.data.text}`,
            life: 3000
        });
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Action Unselected',
            detail: `Id: ${event.data.id} Name: ${event.data.text}`,
            life: 3000
        });
    };
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ctp: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            ntp: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            endda: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            begda: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            }
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        let value1 = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value1;

        setFilters(_filters);
        setGlobalFilterValue(value1);
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1" />
                <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                <div className="flex-grow-1"></div>
                <b>{translations[selectedLanguage].UserattsList}</b>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={translations[selectedLanguage].KeywordSearch} />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label={translations[selectedLanguage].Clear} outlined onClick={clearFilter} text raised />
                </div>
            </div>
        );
    };

    const formatDateColumn = (rowData, field) => {
        return DateFunction.formatDate(rowData[field]);
    };

    // <--- Dialog

//     const setCmnParDialog = () => {
//       setCmnParVisible(true)
//   }    
    const setAdmUserattsDialog = (admUseratts) => {
        setVisible(true);
        setUserattsTip('CREATE');
        setAdmUseratts({ ...admUseratts });
    };

//     const handleParClick = async (admUseratts) => {
//       try {
//           const cmnParService = new CmnParService();
//           const cmnParData = await cmnParService.getCmnPar(admUseratts.par);
//           console.log(admUseratts, "------------------handleParClick--------------------", cmnParData)
//           setCmnPar(cmnParData);
//           setParTip(cmnParData.tp)
//           setCmnParDialog()
//       } catch (error) {
//           console.error(error);
//           toast.current.show({
//               severity: "error",
//               summary: "Error",
//               detail: "Failed to fetch cmnPar data",
//               life: 3000,
//           });
//       }
//   };    
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const userattsTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setAdmUserattsDialog(rowData);
                        setUserattsTip('UPDATE');
                    }}
                    text
                    raised
                ></Button>
                {/* <Button
                    type="button"
                    icon="pi pi-user p-button-danger"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        handleParClick(rowData);
                        setParTip('UPDATE');
                    }}
                    text
                    raised
                ></Button> */}
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">{translations[selectedLanguage].Username}</label>
                            <InputText id="code" value={props.admUser.username} disabled={true} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="mail">{translations[selectedLanguage].Mail}</label>
                            <InputText id="mail" value={props.admUser.mail} disabled={true} />
                        </div>
                    </div>
                </div>
            </div>
            <DataTable
                dataKey="id"
                selectionMode="single"
                selection={admUseratts}
                loading={loading}
                value={admUserattss}
                header={header}
                showGridlines
                removableSort
                filters={filters}
                scrollable
                scrollHeight="550px"
                //virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: '50rem' }}
                metaKeySelection={false}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onSelectionChange={(e) => setAdmUseratts(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    //bodyClassName="text-center"
                    body={userattsTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
                <Column field="catt" header={translations[selectedLanguage].Code} sortable filter style={{ width: '10%' }}></Column>
                <Column field="natt" header={translations[selectedLanguage].Text} sortable filter style={{ width: '30%' }}></Column>
                <Column field="vrednost" header={translations[selectedLanguage].Vrednost} sortable filter style={{ width: '30%' }}></Column>
                <Column field="zzcode" header={translations[selectedLanguage].zzcode} sortable filter style={{ width: '10%' }}></Column>
                <Column field="begda" header={translations[selectedLanguage].Begda} sortable filter style={{ width: '10%' }} body={(rowData) => formatDateColumn(rowData, 'begda')}></Column>
                <Column field="endda" header={translations[selectedLanguage].Endda} sortable filter style={{ width: '10%' }} body={(rowData) => formatDateColumn(rowData, 'endda')}></Column>
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].Useratts}
                visible={visible}
                style={{ width: '60%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                      <AdmUseratts 
                        parameter={'inputTextValue'} 
                        admUseratts={admUseratts} 
                        admUser={props.admUser} 
                        handleDialogClose={handleDialogClose} 
                        setVisible={setVisible} 
                        dialog={true} 
                        userattsTip={userattsTip} 
                      />)}
                <div className="p-dialog-header-icons" style={{ display: 'none' }}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog>
            {/* <Dialog
                header={translations[selectedLanguage].Par}
                visible={cmnParVisible}
                style={{ width: '80%', height: '1100px' }}
                onHide={() => {
                    setCmnParVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnParVisible && (
                    <CmnPar
                      parameter={"inputTextValue"}
                      cmnPar={cmnPar}
                      handleDialogClose={handleDialogClose}
                      setCmnParVisible={setCmnParVisible}
                      dialog={true}
                      userattsTip={userattsTip}   
                      admParUser={true}                 
                    />
                )}
            </Dialog> */}
        </div>
    );
}
