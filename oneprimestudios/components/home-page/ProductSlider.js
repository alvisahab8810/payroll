import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
// import "swiper/css/navigation";

export default function ProductSlider() {
  const products = [
    {
      id: 1,
      title: "Men's Polo T-Shirts",
      price: "BUY 1 @ Rs.550",
      img: "/assets/images/products/mens-photo.png",
    },
    {
      id: 2,
      title: "Standard Visiting Cards",
      price: "BUY 100 @ Rs.200",
      img: "/assets/images/products/standar-card.png",

    },
    {
      id: 3,
      title: "Hoodies",
      price: "BUY 1 @ Rs.550",
      img: "/assets/images/products/hoodies.png",

    },
    {
      id: 4,
      title: "Self inking stamps",
      price: "BUY 1 @ Rs.290",
      img: "/assets/images/products/self.png",

    },
    {
      id: 5,
      title: "Men’s T-shirts",
      price: "BUY 1 @ Rs.450",
      img: "/assets/images/products/mens-photo.png",

    },


    {
      id: 1,
      title: "Men's Polo T-Shirts",
      price: "BUY 1 @ Rs.550",
      img: "/assets/images/products/mens-photo.png",
    },
    {
      id: 2,
      title: "Standard Visiting Cards",
      price: "BUY 100 @ Rs.200",
      img: "/assets/images/products/standar-card.png",

    },
    {
      id: 3,
      title: "Hoodies",
      price: "BUY 1 @ Rs.550",
      img: "/assets/images/products/hoodies.png",

    },
    {
      id: 4,
      title: "Self inking stamps",
      price: "BUY 1 @ Rs.290",
      img: "/assets/images/products/self.png",

    },
    {
      id: 5,
      title: "Men’s T-shirts",
      price: "BUY 1 @ Rs.450",
      img: "/assets/images/products/mens-photo.png",

    },
  ];

  return (
    <div className="product-slider">
      <h2>Our Most popular Products</h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        grabCursor={true}

        slidesPerView={4.3}
        // navigation
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4.3 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="product-card">
              <div className="price-tag">{product.price}</div>
              <img src={product.img} alt={product.title} />
              <div className="title">{product.title}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
