package cz.cvut.fel.rsp.ReservationSystem.service.impl;

import cz.cvut.fel.rsp.ReservationSystem.dao.CategoryRepository;
import cz.cvut.fel.rsp.ReservationSystem.dao.EventRepository;
import cz.cvut.fel.rsp.ReservationSystem.dao.SourceRepository;
import cz.cvut.fel.rsp.ReservationSystem.exception.ReservationSystemException;
import cz.cvut.fel.rsp.ReservationSystem.model.reservation.Address;
import cz.cvut.fel.rsp.ReservationSystem.model.reservation.Category;
import cz.cvut.fel.rsp.ReservationSystem.model.reservation.ReservationSystem;
import cz.cvut.fel.rsp.ReservationSystem.model.reservation.Source;
import cz.cvut.fel.rsp.ReservationSystem.model.reservation.events.Event;
import cz.cvut.fel.rsp.ReservationSystem.service.interfaces.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SourceServiceImpl implements SourceService {
    private final SourceRepository dao;
    private final CategoryRepository categoryRepository;
    private final EventRepository eventRepository;

    @Autowired
    public SourceServiceImpl(SourceRepository dao, CategoryRepository categoryRepository, EventRepository eventRepository) {
        this.dao = dao;
        this.categoryRepository = categoryRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    @Transactional
    public void createSource(Source source, ReservationSystem reservationSystem) {
        source.setReservationSystem(reservationSystem);

        Category initialCategory = new Category();
        initialCategory.setName("Main events");
        initialCategory.setSource(source);

        categoryRepository.save(initialCategory);

        source.setCategories(Arrays.asList(initialCategory));

        dao.save(source);
    }

    @Override
    @Transactional
    public void removeAddress(Source source) {
        if (source.getAddress()!=null){
            source.setAddress(null);
            dao.save(source);
        }
    }

    @Override
    @Transactional
    public void addAddress(Source source, Address address) {
        if (source.getAddress()== null){
            source.setAddress(address);
            dao.save(source);
        }
        else{
            throw new ReservationSystemException("Source already has address " + source.getAddress());
        }
    }

    @Transactional
    public void addCategory(Source source, Category category){
        if (source.getCategories().contains(category)){
            throw new ReservationSystemException("Source already has category with this name " + category.getName());
        }

        source.getCategories().add(category);
        category.setSource(source);
        categoryRepository.save(category);
        dao.save(source);
    }

    @Transactional
    public void removeCategory(Source source, Category category){
        if (!source.getCategories().contains(category)){
            throw new ReservationSystemException("Source " + source.getName() + " does not have this category " + category.getName());
        }

        if (category.getName().equals("Main events")){
            throw new ReservationSystemException("You can not delete main category");
        }
        Category helperCategory = null;
        for (Category category1: source.getCategories()) {
            if (category1.getName().equals("Main events")){
                helperCategory = category1;
            }
        }

        helperCategory.getEvents().addAll(category.getEvents());
        categoryRepository.save(helperCategory);
        for (Event event: category.getEvents()) {
            event.setCategory(helperCategory);
            eventRepository.save(event);
        }
        source.getCategories().remove(category);
        dao.save(source);
    }

    @Transactional
    public boolean exists(Source source){
        return dao.existsById(source.getId());
    }
}
