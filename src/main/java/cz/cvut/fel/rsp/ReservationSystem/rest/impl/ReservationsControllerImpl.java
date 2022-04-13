package cz.cvut.fel.rsp.ReservationSystem.rest.impl;

import cz.cvut.fel.rsp.ReservationSystem.rest.DTO.PaymentDTO;
import cz.cvut.fel.rsp.ReservationSystem.rest.DTO.ReservationDTO;
import cz.cvut.fel.rsp.ReservationSystem.rest.DTO.ReservationSystemDTO;
import cz.cvut.fel.rsp.ReservationSystem.rest.interfaces.ReservationsController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/v1/")
@Slf4j
@RequiredArgsConstructor
public class ReservationsControllerImpl implements ReservationsController {

    @Override
    @GetMapping(value = "/reservations/{reservationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ReservationDTO getById(@PathVariable Integer reservationId) {
        return null;
    }

    @Override
    public PaymentDTO getPayment(Integer reservationId) {
        return null;
    }

    @Override
    @GetMapping(value = "/reservations/today", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ReservationDTO> getAllToday() {
        return null;
    }

    @Override
    @GetMapping(value = "/reservations", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ReservationDTO> getAllForDay(@RequestParam(name = "year") Integer year, @RequestParam(name = "month") Integer month, @RequestParam(name = "day") Integer day) {
        return null;
    }

    @PostMapping(value = "/reservations", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ReservationDTO> getAllForInterval(@RequestParam("yearFrom") Integer yearFrom,
                                                  @RequestParam("monthFrom") Integer monthFrom,
                                                  @RequestParam("dayFrom") Integer dayFrom,
                                                  @RequestParam("yearTo") Integer yearTo,
                                                  @RequestParam("monthTo") Integer monthTo,
                                                  @RequestParam("dayTo") Integer dayTo) {
        return null;
    }
}