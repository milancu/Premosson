package cz.cvut.fel.rsp.ReservationSystem.dao;

import cz.cvut.fel.rsp.ReservationSystem.model.reservation.Reservation;
import cz.cvut.fel.rsp.ReservationSystem.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    @Query(value = "select p from Reservation p where p.user = ?1")
    List<Reservation> findAllUsersReservations(User user);

    @Query(value = "SELECT r FROM Reservation r WHERE r.id = :reservation_id")
    Reservation findReservationById(@Param("reservation_id") Integer reservationId);

    @Query(value = "SELECT r FROM Reservation r WHERE r.user.id = :user_id AND r.payment IS NULL")
    List<Reservation> findAllUsersUnpaidReservations(@Param("user_id")Integer userId);

    @Query(value = "SELECT r FROM Reservation r where r.reservationSlot.id = :reservationSlot_id")
    Reservation findReservationForReservationSlot(@Param("reservationSlot_id") Integer slotId);

    /*@Query("SELECT r from ReservationSystem rs join Source s on rs.id = s.reservationSystem.id join Category c on s. = c.id")
    List<Reservation> findAllReservationsForReservationSystem(@Param("system_Id") Integer systemId);*/
}
