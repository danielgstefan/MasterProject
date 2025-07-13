package org.gds.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tuning_requests")
public class TuningRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String model;

    @Column(name = "model_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String engine;

    @Column(nullable = false)
    private String fuelType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TuningType tuningType;

    @Column
    private String currentPower;

    @Column
    private String desiredPower;

    @Column
    private Boolean removeEmissionControl;

    @Column
    private String exhaustType;

    @Column
    private String downpipeType;

    @Column
    private Boolean wantsSoundClip;

    @Column
    private String suspensionType;

    @Column
    private String currentHeight;

    @Column
    private String desiredHeight;

    @Column
    private Boolean needsAlignment;

    @Column
    private String additionalNotes;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static enum TuningType {
        ENGINE, EXHAUST, SUSPENSION
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getEngine() { return engine; }
    public void setEngine(String engine) { this.engine = engine; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public TuningType getTuningType() { return tuningType; }
    public void setTuningType(TuningType tuningType) { this.tuningType = tuningType; }

    public String getCurrentPower() { return currentPower; }
    public void setCurrentPower(String currentPower) { this.currentPower = currentPower; }

    public String getDesiredPower() { return desiredPower; }
    public void setDesiredPower(String desiredPower) { this.desiredPower = desiredPower; }

    public Boolean getRemoveEmissionControl() { return removeEmissionControl; }
    public void setRemoveEmissionControl(Boolean removeEmissionControl) { this.removeEmissionControl = removeEmissionControl; }

    public String getExhaustType() { return exhaustType; }
    public void setExhaustType(String exhaustType) { this.exhaustType = exhaustType; }

    public String getDownpipeType() { return downpipeType; }
    public void setDownpipeType(String downpipeType) { this.downpipeType = downpipeType; }

    public Boolean getWantsSoundClip() { return wantsSoundClip; }
    public void setWantsSoundClip(Boolean wantsSoundClip) { this.wantsSoundClip = wantsSoundClip; }

    public String getSuspensionType() { return suspensionType; }
    public void setSuspensionType(String suspensionType) { this.suspensionType = suspensionType; }

    public String getCurrentHeight() { return currentHeight; }
    public void setCurrentHeight(String currentHeight) { this.currentHeight = currentHeight; }

    public String getDesiredHeight() { return desiredHeight; }
    public void setDesiredHeight(String desiredHeight) { this.desiredHeight = desiredHeight; }

    public Boolean getNeedsAlignment() { return needsAlignment; }
    public void setNeedsAlignment(Boolean needsAlignment) { this.needsAlignment = needsAlignment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
