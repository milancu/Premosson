package cz.cvut.fel.rsp.ReservationSystem.model.reservation.slots;

import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.time.LocalTime;

@Entity
@Getter @Setter @NoArgsConstructor
public class Interval extends ReservationSlot{

    @NotNull
    @Column(name = "start_time")
    private LocalTime start;

    @NotNull
    @Column(name = "end_time")
    private LocalTime end;
}
