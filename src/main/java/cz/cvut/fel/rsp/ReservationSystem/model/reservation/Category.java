package cz.cvut.fel.rsp.ReservationSystem.model.reservation;

import com.sun.istack.NotNull;
import cz.cvut.fel.rsp.ReservationSystem.model.AbstractEntity;
import cz.cvut.fel.rsp.ReservationSystem.model.reservation.events.Event;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor
public class Category extends AbstractEntity {
    @NotNull
    private String name;

    @ManyToMany
    @NotNull
    private List<Source> sources;

    @OneToMany(mappedBy = "category")
    private List<Event> events;

    @Override
    public String toString() {
        return "Category{" +
                "name='" + name + '\'' +
                ", sources=" + sources +
                ", events=" + events +
                '}';
    }
}
