package LT_Web2.DoAn.controller;

import LT_Web2.DoAn.entity.Banner;
import LT_Web2.DoAn.service.BannerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin("*")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public List<Banner> getAllBanners() {
        return bannerService.getAllBanners();
    }

    @GetMapping("/active")
    public List<Banner> getActiveBanners() {
        return bannerService.getActiveBanners();
    }

    @GetMapping("/{id}")
    public Banner getBannerById(@PathVariable Long id) {
        return bannerService.getBannerById(id);
    }

    @PostMapping
    public Banner createBanner(@RequestBody Banner banner) {
        return bannerService.saveBanner(banner);
    }

    @PutMapping("/{id}")
    public Banner updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        return bannerService.updateBanner(id, banner);
    }

    @DeleteMapping("/{id}")
    public void deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
    }
}
