package LT_Web2.DoAn.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    private String subtitle;
    
    @Column(length = 1000)
    private String description;
    
    @Column(length = 500)
    private String imageUrl;
    
    private String buttonText;
    
    private String link;
    
    private boolean isActive = true;
    
    private int displayOrder = 0;

    public Banner() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getButtonText() { return buttonText; }
    public void setButtonText(String buttonText) { this.buttonText = buttonText; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public boolean getIsActive() { return isActive; }
    public void setIsActive(boolean active) { isActive = active; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
