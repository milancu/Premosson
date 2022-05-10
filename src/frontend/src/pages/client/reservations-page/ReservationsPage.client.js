import styles from './ReservationPage.module.scss'
import {Calendar, DateObject} from "react-multi-date-picker"
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseUrl} from "../../../config/const";
import ModalReservationDetails from "./modalWindowReservationDetails/ModalReservationDetails"
import authHeader from "../../../services/auth-header";
import ModalCreateReservation from "./modalWindowCreateReservation/ModalCreateReservation";

const TopButtons = () => {

    return (
        <div className={styles.topbuttons}>
            <p className={styles.heading}>DAILY RESERVATION OVERVIEW</p>
            <button className={'button-primary '.concat(styles.topbutton)}>Filter</button>
            <button className={'button-primary '.concat(styles.topbutton)}>Statistics</button>
            <button className={'button-primary '.concat(styles.topbutton)}>Export reservations</button>
        </div>
    )
}

const DatePicker = ( {getDate} ) => {
    const [date, setDate] = useState(new DateObject())

    useEffect(()=>{
        getDate(date)
    }, [date])

    return (
        <>
            <Calendar
                numberOfMonths={4}
                disableMonthPicker
                disableYearPicker
                value={date}
                onChange={setDate}
            />
        </>
    )
}

const Table = () => {
    const reload=()=>window.location.reload();
    const [date, setDate] = useState(new DateObject())

    const [data, setData] = useState([]);
    const [detailsShown, setDetailsShown] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalCreateReservation, setOpenModalCreateReservation] = useState(false);

    useEffect(()=>{
        sendGetEvents(date.format("YYYY-MM-DD"))
    }, [date])

    const getDate = (date) => {
        setDate(date)
    }

    const sendGetEvents = async (date) => {
        try {
            const resp0 = await axios.get(
                `${baseUrl}/systems/my`,
                {headers: authHeader()})
            let system = resp0.data.id

            const resp = await axios.get(
                `${baseUrl}/systems/${system}/reservations/`,
                {params: {fromDate: date, toDate: date},
                    headers: authHeader()})

            for (let i = 0; i < resp.data.length; i++) {
                await concatReservationDetails(resp.data[i])
            }
            setData(resp.data)
            //console.log(resp.data);
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };

    const concatReservationDetails = async (reservation) => {
        try {
            //----------------------------------------
            const respUser = await axios.get(
                `${baseUrl}/users/${reservation.username}`,
                {headers: authHeader()},
            )
            reservation["userEmail"] = respUser.data.email;
            reservation["userFirstName"] = respUser.data.firstName;
            reservation["userLastName"] = respUser.data.lastName;

            const respSlot = await axios.get(
                `${baseUrl}/slots/${reservation.reservationSlotId}`,
                {headers: authHeader()}
            )
            reservation["date"] = respSlot.data.date;
            reservation["pricing"] = respSlot.data.price;
            if (respSlot.data.hasOwnProperty('seatIdentifier')){
                reservation["seatIdentifier"] = respSlot.data.seatIdentifier
            }

            const respEvent = await axios.get(
                `${baseUrl}/events/${respSlot.data.eventId}`,
                {headers: authHeader()}
            )
            reservation["fromTime"] = respEvent.data.fromTime;
            reservation["toTime"] = respEvent.data.toTime;

            const respCategory = await axios.get(
                `${baseUrl}/categories/${respEvent.data.categoryId}`,
                {headers: authHeader()}
            )

            const sources = []
            for (const sourceId of respCategory.data.sourcesIds) {
                const respSource = await axios.get(
                    `${baseUrl}/sources/${sourceId}`,
                    {headers: authHeader()}
                )
                sources.push(respSource.data.name)
            }
            reservation["sources"] = sources;

            reservation["capacity"] = 1;
            if (reservation.cancelled === false){
                reservation["state"] = "Active"
            }
            if (reservation.cancelled === true){
                reservation["state"] = "Cancelled"
            }
            return reservation
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };


    const toggleShown = id => {
        const shownState =  detailsShown.slice();
        const index = shownState.indexOf(id)
        if (index >= 0){
            shownState.splice(index, 1);
            setDetailsShown(shownState)
        } else {
            shownState.push(id);
            setDetailsShown(shownState);
        }
    }

    const afterModalClose = () => {
        window.location.reload();
    }

    return (
        <div>
            <div className={styles.datePickerPart}>
                <div className={styles.datePickerPartRight}>
                    <DatePicker getDate={getDate}/>
                </div>
            </div>
            <div className={styles.undercalendar}>
                <div className={styles.datedisplay}>
                    <p>
                        {date?.format("dddd MMMM D, YYYY")}
                    </p>
                </div>
                <div className={'calendar-description '.concat(styles.caldescr)}>

                    <p className={' '.concat(styles.pdescr)}>
                        RESERVATIONS: {data.length}
                    </p>
                </div>
            </div>
            {openModal && <ModalReservationDetails closeModal={setOpenModal}/>}
            {openModalCreateReservation && <ModalCreateReservation closeModal={setOpenModalCreateReservation} onExit={reload}/>}
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                    <tr>
                        <td className={styles.collCheckbox}>
                            <input type="checkbox" />
                        </td>
                        <td className={styles.collMid}>
                            <p>EVENT</p>
                        </td>
                        <td className={styles.collWide}>
                            <p>RESERVATION CODE</p>
                            <input className={'input-primary search sh sm'} placeholder={'Find names'}/>
                        </td>
                        <td className={styles.collMid}>
                            <p>PRICE</p>
                        </td>
                        <td className={styles.collNarrow}>
                            <p>CAP.</p>
                        </td>
                        <td className={styles.collWide}>
                            <p>CUSTOMER</p>
                            <input className={'input-primary search sh sm'} placeholder={'Find names'}/>
                        </td>
                        <td className={styles.collMid}>
                            <p>STATE</p>
                        </td>
                        <td className={styles.collWide}>
                            <p>DATE</p>
                        </td>
                        <td className={styles.collMid}>
                            <button className={'button-primary'} onClick={() => setOpenModalCreateReservation(true)}>Create Reservation</button>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                        {data.map(reservation => (
                            <React.Fragment key={reservation.reservationId}>
                            <tr className={styles.headRow}>
                                <td className={styles.collCheckbox}>
                                    <input className={'checkbox'} type="checkbox" />
                                    <button onClick={() => toggleShown(reservation.reservationId)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" fill="none" viewBox="0 0 16 19">
                                            <path fill="#000"  d="M.685 6.14 2.05 4.55l5.581 6.524 5.593-6.51 1.362 1.593-6.958 8.1L.685 6.14Z"/>
                                        </svg>
                                    </button>
                                </td>
                                <td>{reservation.fromTime}-{reservation.toTime}</td>
                                <td>{reservation.reservationId}</td>
                                <td><b>{reservation.pricing} $</b></td>
                                <td>{reservation.capacity}</td>
                                <td>{reservation.userFirstName} {reservation.userLastName}</td>
                                <td>{reservation.state}</td>
                                <td>{reservation.date}</td>
                                <td>
                                    <div className={styles.buttonsTable}>
                                        <div className={styles.detailsButton}>
                                            <button className={'button-primary-outline'} onClick={() => setOpenModal(true)}>Details</button>
                                        </div>
                                        <button className={'button-primary-outline '}>Cancel</button>
                                    </div>
                                </td>
                            </tr>
                                {detailsShown.includes(reservation.reservationId) && (
                                    <tr>
                                        {reservation.hasOwnProperty('seatIdentifier')?
                                            <td colSpan="2" className={styles.toggleInfo}>
                                                SEAT: <br/>{reservation.seatIdentifier}</td>:
                                            <td colSpan="2" className={styles.toggleInfo}>
                                            </td>}
                                        <td colSpan="2" className={styles.toggleInfo}>SOURCES: <br/>{reservation.sources}</td>
                                        <td colSpan="2" className={styles.toggleInfo}>E-MAIL: <br/><a className={styles.mailHref} href={"mailto:" + reservation.userEmail}>{reservation.userEmail}</a></td>
                                        <td colSpan="2" className={styles.toggleInfo}>DESCRIPTION: <br/>{reservation.additionalInfo}</td>
                                        <td> </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        <div className={styles.containerFunction}>
                        </div>
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export const ReservationsPageClient = () => {
    return(
        <div className={styles.container}>
            <TopButtons/>
            <Table/>
        </div>
    )
}