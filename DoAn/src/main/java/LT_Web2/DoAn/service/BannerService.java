package LT_Web2.DoAn.service;

import LT_Web2.DoAn.entity.Banner;
import LT_Web2.DoAn.repository.BannerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public List<Banner> getAllBanners() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc();
    }

    public List<Banner> getActiveBanners() {
        return bannerRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public Banner getBannerById(Long id) {
        return bannerRepository.findById(id).orElse(null);
    }

    public Banner saveBanner(Banner banner) {
        return bannerRepository.save(banner);
    }

    public Banner updateBanner(Long id, Banner updatedBanner) {
        Banner banner = bannerRepository.findById(id).orElse(null);
        if (banner != null) {
            banner.setTitle(updatedBanner.getTitle());
            banner.setSubtitle(updatedBanner.getSubtitle());
            banner.setDescription(updatedBanner.getDescription());
            banner.setImageUrl(updatedBanner.getImageUrl());
            banner.setButtonText(updatedBanner.getButtonText());
            banner.setLink(updatedBanner.getLink());
            banner.setIsActive(updatedBanner.getIsActive());
            banner.setDisplayOrder(updatedBanner.getDisplayOrder());
            return bannerRepository.save(banner);
        }
        return null;
    }

    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }
}
