import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { classNames } from "primereact/utils";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { AdmUserService } from "../../service/model/AdmUserService";
import AdmUser from './admUser';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';


export default function AdmUserL() {
  const objName = "adm_user"
  const emptyAdmUser = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admUsers, setAdmUsers] = useState([]);
  const [admUser, setAdmUser] = useState(emptyAdmUser);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [userTip, setUserTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const admUserService = new AdmUserService();
        const data = await admUserService.getAdmUserV();
        setAdmUsers(data);
        initFilters();
        setLoading(false)
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };
    //console.log("*-*-*-*--*-*-*-*-*-*-*-", localObj)

    let _admUsers = [...admUsers];
    let _admUser = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.userTip === "CREATE") {
      _admUsers.push(_admUser);
    } else if (localObj.newObj.userTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admUsers[index] = _admUser;
    } else if ((localObj.newObj.userTip === "DELETE")) {
      _admUsers = admUsers.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUser Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUser ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.userTip}`, life: 3000 });
    setAdmUsers(_admUsers);
    setAdmUser(emptyAdmUser);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admUsers.length; i++) {
      if (admUsers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmUserDialog(emptyAdmUser);
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "User Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "User Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      username: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      firstname: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      lastname: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      mail: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      gtext: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      tip: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      created_at: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },      
      valid: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        <div className="flex flex-wrap gap-1">
          <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1" />
        <b>User List</b>
        <div className="flex-grow-1"></div>
        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  const validBodyTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": rowData.valid,
          "text-red-500 pi-times-circle": !rowData.valid,
        })}
      ></i>
    );
  };

  const validFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Valid
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };  

  const header = renderHeader();
  // heder za filter/>

  // <--- Dialog
  const setAdmUserDialog = (newAdmUser) => {
    setVisible(true)
    setUserTip("CREATE")
    setAdmUser({ ...newAdmUser });
    console.log("DialogTrue", admUser)
  }
  //  Dialog --->

  const userTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmUserDialog(rowData)
            setUserTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={admUser}
        loading={loading}
        value={admUsers}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="750px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setAdmUser(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={userTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />        
        <Column
          field="username"
          header="Username"
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="firstname"
          header="First Name"
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>   
        <Column
          field="lastname"
          header="Last Name"
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>              
        <Column
          field="mail"
          header="Mail"
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="gtext"
          header="Group"
          sortable
          filter
          style={{ width: "30%" }}
        ></Column> 
        <Column
          field="tip"
          header="Tip"
          sortable
          filter
          style={{ width: "5%" }}
        ></Column>                       
        <Column
          field="valid"
          filterField="valid"
          dataType="numeric"
          header="Valid"
          sortable
          filter
          filterElement={validFilterTemplate}
          style={{ width: "15%" }}
          bodyClassName="text-center"
          body={validBodyTemplate}
        ></Column>        
      </DataTable>
      <Dialog
        header="User"
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmUser
            parameter={"inputTextValue"}
            admUser={admUser}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            userTip={userTip}
          />
        )}
      </Dialog>
    </div>
  );
}
