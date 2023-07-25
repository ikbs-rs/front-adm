import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmParuserService } from "../../service/model/AdmParuserService";
import AdmParuser from './admParuser';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function AdmParuserL(props) {
console.log("ПАРУСЕР", props)
  const objName = "adm_paruser"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyAdmParuser = EmptyEntities[objName]
  emptyAdmParuser.usr = props.admUser.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admParusers, setAdmParusers] = useState([]);
  const [admParuser, setAdmParuser] = useState(emptyAdmParuser);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [paruserTip, setParuserTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setAdmParuserLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const admParuserService = new AdmParuserService();
          const data = await admParuserService.getLista(props.admUser.id);
          console.log("LOCATION podaci", data)
          setAdmParusers(data);

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

    let _admParusers = [...admParusers];
    let _admParuser = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.paruserTip === "CREATE") {
      _admParusers.push(_admParuser);
    } else if (localObj.newObj.paruserTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admParusers[index] = _admParuser;
    } else if ((localObj.newObj.paruserTip === "DELETE")) {
      _admParusers = admParusers.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmParuser Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmParuser ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.paruserTip}`, life: 3000 });
    setAdmParusers(_admParusers);
    setAdmParuser(emptyAdmParuser);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admParusers.length; i++) {
      if (admParusers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmParuserDialog(emptyAdmParuser);
  };

  const onRowSelect = (event) => {
    //admParuser.begda = event.data.begda
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ctp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ntp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],       
      },
      endda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],       
      },
      begda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],       
      }      
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    let value1 = e.target.value
    let _filters = { ...filters };

    _filters["global"].value = value1;

    setFilters(_filters);
    setGlobalFilterValue(value1);
  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].ParuserList}</b>
        <div className="flex-grow-1"></div>
        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={translations[selectedLanguage].KeywordSearch}
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label={translations[selectedLanguage].Clear}
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  // <--- Dialog
  const setAdmParuserDialog = (admParuser) => {
    setVisible(true)
    setParuserTip("CREATE")
    setAdmParuser({ ...admParuser });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const paruserTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmParuserDialog(rowData)
            setParuserTip("UPDATE")
          }}
          text
          raised ></Button>

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
              <InputText id="code"
                value={props.admUser.gtext}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
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
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={admParuser}
        loading={loading}
        value={admParusers}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="550px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setAdmParuser(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={paruserTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cpar"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="npar"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "60%" }}
        ></Column>      
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column>  
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>         
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Link}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmParuser
            parameter={"inputTextValue"}
            admParuser={admParuser}
            admUser={props.admUser}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            paruserTip={paruserTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
    </div>
  );
}
