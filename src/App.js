import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './index.css';

import AppTopbar from './AppTopbar';
import AppFooter from './AppFooter';
import AppConfig from './AppConfig';
import AppMenu from './AppMenu';
import AppRightMenu from './AppRightMenu';

import UserGrp from './components/model/admUserGrpL';
import Useratt from './components/model/admUserattL';
import LocTP from './components/model/cmnLoctpL';
import User from './components/model/admUserL';
import Roll from './components/model/admRollL';
import Action from './components/model/admActionL';

import DbParameter from './components/model/admDbParameterL';
import Message from './components/model/admMessageL';
import DbmsErr from './components/model/admDbmsErrL';
import IconsDemo from './utilities/IconsDemo';
import EmptyPage from './pages/EmptyPage';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import env from "./configs/env"
import { useDispatch } from 'react-redux';
import { setLanguage } from './store/actions';
import { translations } from "./configs/translations";
import { checkPermissions } from "./security/interceptors"

const App = () => {
    const dispatch = useDispatch();
    const urlParams = new URLSearchParams(window.location.search);
    let selectedLanguage = localStorage.getItem('sl')
    //let selectedLanguage = urlParams.get('sl');
    const [layoutMode, setLayoutMode] = useState('static');
    const [lightMenu, setLightMenu] = useState(true);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
    const [isRTL, setIsRTL] = useState(false);
    const [inlineUser, setInlineUser] = useState(false);
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const [activeTopbarItem, setActiveTopbarItem] = useState(null);
    const [rightPanelMenuActive, setRightPanelMenuActive] = useState(null);
    const [inlineUserMenuActive, setInlineUserMenuActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [topbarColor, setTopbarColor] = useState('layout-topbar-green');
    const [theme, setTheme] = useState('blue');
    const [configActive, setConfigActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('filled');
    const [ripple, setRipple] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const inlineUserRef = useRef();

    const menu = [  
        {
            label: translations[selectedLanguage].ACCESS_PERMISSION,
            icon: 'pi pi-fw pi-star-fill',
            items: [
                { label: translations[selectedLanguage].Useratt, icon: 'pi pi-fw pi-id-card', to: '/useratt' },
                { label: translations[selectedLanguage].Usergroups, icon: 'pi pi-fw pi-id-card', to: '/usergrp' },
                { label: translations[selectedLanguage].Users, icon: 'pi pi-users', to: '/user' },
                { label: translations[selectedLanguage].Rolls, icon: 'pi pi-fw pi-bookmark', to: '/roll' },
                { label: translations[selectedLanguage].Actions, icon: 'pi pi-map-marker', to: '/action' }
            ]
        },
        {
            label: 'Settings',
            label: translations[selectedLanguage].Settings,
            icon: 'pi pi-prime',
            items: [
                { label: translations[selectedLanguage].DBparameters, icon: 'pi pi-database', to: '/dbparameter' },
                { label: translations[selectedLanguage].Messages, icon: 'pi pi-fw pi-clone', to: '/message' },
                { label: translations[selectedLanguage].DBMSerrors, icon: 'pi pi-fw pi-exclamation-triangle', to: '/dbmserr' }
            ]
        },
        {
            label: 'Module selection',
            label: translations[selectedLanguage].Moduleselection,
            icon: 'pi pi-fw pi-compass',
            items: [
                { label: translations[selectedLanguage].Back, icon: 'pi pi-sign-out', url: `${env.START_URL}` },
                { /*label: 'Back', icon: 'pi pi-sign-out', url: `${env.START_URL}?sl=${selectedLanguage}` */}
            ]
        }
    ];

    let topbarItemClick;
    let menuClick;
    let rightMenuClick;
    let userMenuClick;
    let configClick = false;
    let iRef = useRef(0);

    const [filteredMenu, setFilteredMenu] = useState([]);
    
    useEffect(() => {
        iRef.current++;
        if (iRef.current<2) {
            async function filterMenuItems(menu) {
                const filteredMenuL = [];
        
                for (const item of menu) {
                    const filteredItem = { ...item };
        
                    if (item.items) {
                        // Filtriranje podmenija
                        const filteredSubMenu = await filterMenuItems(item.items);
                        if (filteredSubMenu.length > 0) {
                            filteredItem.items = filteredSubMenu;
                        } else {
                            delete filteredItem.items;
                        }
                    }
        
                    if (await checkPermissions(item.action)) {
                        // Dodajemo samo ako ima akciju ili podmeni
                        filteredMenuL.push(filteredItem);
                    }                    
                    // if (item.action || filteredItem.items) {
                    //     // Dodajemo samo ako ima akciju ili podmeni
                    //     filteredMenuL.push(filteredItem);
                    // }
                }
                return filteredMenuL;
            }
            async function fetchData() {
                const filteredMenuLL = await filterMenuItems(menu);
                setFilteredMenu(filteredMenuLL); // Postavite stanje filtriranog menija
            }
    
            fetchData();
        }
    }, [menu]);


    useEffect(() => {      
      if (selectedLanguage) {
        dispatch(setLanguage(selectedLanguage)); // Postavi jezik iz URL-a u globalni store
      }
    }, [dispatch]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (staticMenuMobileActive) {
            blockBodyScroll();
        } else {
            unblockBodyScroll();
        }
    }, [staticMenuMobileActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRippleChange = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onDocumentClick = () => {
        if (!topbarItemClick) {
            setActiveTopbarItem(null);
            setTopbarMenuActive(false);
        }

        if (!rightMenuClick) {
            setRightPanelMenuActive(false);
        }

        if (!userMenuClick && isSlim() && !isMobile()) {
            setInlineUserMenuActive(false);
        }

        if (!menuClick) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false);
            }

            if (overlayMenuActive || staticMenuMobileActive) {
                hideOverlayMenu();
            }

            unblockBodyScroll();
        }

        if (configActive && !configClick) {
            setConfigActive(false);
        }

        topbarItemClick = false;
        menuClick = false;
        rightMenuClick = false;
        userMenuClick = false;
        configClick = false;
    };

    const onMenuButtonClick = (event) => {
        menuClick = true;
        setTopbarMenuActive(false);
        setRightPanelMenuActive(false);

        if (layoutMode === 'overlay') {
            setOverlayMenuActive((prevOverlayMenuActive) => !prevOverlayMenuActive);
        }

        if (isDesktop()) setStaticMenuDesktopInactive((prevStaticMenuDesktopInactive) => !prevStaticMenuDesktopInactive);
        else {
            setStaticMenuMobileActive((prevStaticMenuMobileActive) => !prevStaticMenuMobileActive);
            if (staticMenuMobileActive) {
                blockBodyScroll();
            } else {
                unblockBodyScroll();
            }
        }

        event.preventDefault();
    };

    const onTopbarMenuButtonClick = (event) => {
        topbarItemClick = true;
        setTopbarMenuActive((prevTopbarMenuActive) => !prevTopbarMenuActive);
        hideOverlayMenu();
        event.preventDefault();
    };

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;

        if (activeTopbarItem === event.item) setActiveTopbarItem(null);
        else setActiveTopbarItem(event.item);

        event.originalEvent.preventDefault();
    };

    const onMenuClick = () => {
        menuClick = true;
    };

    const onInlineUserClick = () => {
        userMenuClick = true;
        setInlineUserMenuActive((prevInlineUserMenuActive) => !prevInlineUserMenuActive);
        setMenuActive(false);
    };

    const onConfigClick = () => {
        configClick = true;
    };

    const onConfigButtonClick = () => {
        setConfigActive((prevConfigActive) => !prevConfigActive);
        configClick = true;
    };

    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    const onRightMenuButtonClick = (event) => {
        rightMenuClick = true;
        setRightPanelMenuActive((prevRightPanelMenuActive) => !prevRightPanelMenuActive);

        hideOverlayMenu();

        event.preventDefault();
    };

    const onRightMenuClick = () => {
        rightMenuClick = true;
    };

    const hideOverlayMenu = () => {
        setOverlayMenuActive(false);
        setStaticMenuMobileActive(false);
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            hideOverlayMenu();
        }
        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    };

    const onRootMenuItemClick = () => {
        setMenuActive((prevMenuActive) => !prevMenuActive);
        setInlineUserMenuActive(false);
    };

    const isDesktop = () => {
        return window.innerWidth > 896;
    };

    const isMobile = () => {
        return window.innerWidth <= 1025;
    };

    const isHorizontal = () => {
        return layoutMode === 'horizontal';
    };

    const isSlim = () => {
        return layoutMode === 'slim';
    };

    const onLayoutModeChange = (layoutMode) => {
        setLayoutMode(layoutMode);
        setStaticMenuDesktopInactive(false);
        setOverlayMenuActive(false);

        if (layoutMode === 'horizontal' && inlineUser) {
            setInlineUser(false);
        }
    };

    const onMenuColorChange = (menuColor) => {
        setLightMenu(menuColor);
    };

    const onThemeChange = (theme) => {
        setTheme(theme);
    };

    const onProfileModeChange = (profileMode) => {
        setInlineUser(profileMode);
    };

    const onOrientationChange = (orientation) => {
        setIsRTL(orientation);
    };

    const onTopbarColorChange = (color) => {
        setTopbarColor(color);
    };

    const layoutClassName = classNames(
        'layout-wrapper',
        {
            'layout-horizontal': layoutMode === 'horizontal',
            'layout-overlay': layoutMode === 'overlay',
            'layout-static': layoutMode === 'static',
            'layout-slim': layoutMode === 'slim',
            'layout-menu-light': lightMenu,
            'layout-menu-dark': !lightMenu,
            'layout-overlay-active': overlayMenuActive,
            'layout-mobile-active': staticMenuMobileActive,
            'layout-static-inactive': staticMenuDesktopInactive,
            'layout-rtl': isRTL,
            'p-input-filled': inputStyle === 'filled',
            'p-ripple-disabled': !ripple
        },
        topbarColor
    );

    const inlineUserTimeout = layoutMode === 'slim' ? 0 : { enter: 1000, exit: 450 };

    return (
        <div className={layoutClassName} onClick={onDocumentClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar
                topbarMenuActive={topbarMenuActive}
                activeTopbarItem={activeTopbarItem}
                inlineUser={inlineUser}
                onRightMenuButtonClick={onRightMenuButtonClick}
                onMenuButtonClick={onMenuButtonClick}
                onTopbarMenuButtonClick={onTopbarMenuButtonClick}
                onTopbarItemClick={onTopbarItemClick}
            />

            <AppRightMenu rightPanelMenuActive={rightPanelMenuActive} onRightMenuClick={onRightMenuClick}></AppRightMenu>

            <div className="layout-menu-container"  onClick={onMenuClick} >
                {inlineUser && (
                    <div className="layout-profile">
                        <button type="button" className="p-link layout-profile-button" onClick={onInlineUserClick}>
                            <img src="assets/layout/images/avatar.png" alt="roma-layout" />
                            <div className="layout-profile-userinfo">
                                <span className="layout-profile-name">Arlene Welch</span>
                                <span className="layout-profile-role">Design Ops</span>
                            </div>
                        </button>
                        <CSSTransition nodeRef={inlineUserRef} classNames="p-toggleable-content" timeout={inlineUserTimeout} in={inlineUserMenuActive} unmountOnExit>
                            <ul ref={inlineUserRef} className={classNames('layout-profile-menu', { 'profile-menu-active': inlineUserMenuActive })}>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-user"></i>
                                        <span>Profile</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-cog"></i>
                                        <span>Settings</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-envelope"></i>
                                        <span>Messages</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-bell"></i>
                                        <span>Notifications</span>
                                    </button>
                                </li>
                            </ul>
                        </CSSTransition>
                    </div>
                )}
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} layoutMode={layoutMode} active={menuActive} mobileMenuActive={staticMenuMobileActive} />
            </div>

            <div className="layout-main">
                <div className="layout-content">
                    <Routes>
                        <Route path="/" element={<EmptyPage />} />
                        <Route path="/useratt" element={<Useratt />} />
                        <Route path="/usergrp" element={<UserGrp />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/roll" element={<Roll />} />
                        <Route path="/action" element={<Action />} />
                        <Route path="/dbparameter" element={<DbParameter />} />
                        <Route path="/message" element={<Message />} />
                        <Route path="/dbmserr" element={<DbmsErr />} />
                        <Route path="/icons" element={<IconsDemo />} />
                        
                        <Route path="/loctp" element={<LocTP />} />
                        <Route path="/loc" element={<UserGrp />} />
                        <Route path="/locatt" element={<UserGrp />} />
                        <Route path="/loclinktp" element={<UserGrp />} />
                    </Routes>
                </div>

                <AppConfig
                    configActive={configActive}
                    onConfigClick={onConfigClick}
                    onConfigButtonClick={onConfigButtonClick}
                    rippleActive={ripple}
                    onRippleChange={onRippleChange}
                    inputStyle={inputStyle}
                    onInputStyleChange={onInputStyleChange}
                    theme={theme}
                    onThemeChange={onThemeChange}
                    topbarColor={topbarColor}
                    onTopbarColorChange={onTopbarColorChange}
                    inlineUser={inlineUser}
                    onProfileModeChange={onProfileModeChange}
                    isRTL={isRTL}
                    onOrientationChange={onOrientationChange}
                    layoutMode={layoutMode}
                    onLayoutModeChange={onLayoutModeChange}
                    lightMenu={lightMenu}
                    onMenuColorChange={onMenuColorChange}
                ></AppConfig>

                <AppFooter />
            </div>

            <div className="layout-content-mask"></div>
        </div>
    );
};

export default App;
