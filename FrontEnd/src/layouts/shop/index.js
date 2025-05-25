import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Shop components
import ProductCard from "./components/ProductCard";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Example products data - this would come from your backend
  const products = [
    {
      id: 1,
      name: "BMW M Performance Exhaust",
      category: "exhaust",
      price: 1299.99,
      image: "https://example.com/exhaust.jpg",
      description: "High-performance exhaust system for BMW M models",
    },
    // Add more products here
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <VuiBox mb={3}>
              <VuiTypography variant="h2" fontWeight="bold" color="white">
                BMW Parts Shop
              </VuiTypography>
              <VuiTypography variant="body2" color="text">
                Find the perfect parts for your BMW
              </VuiTypography>
            </VuiBox>
          </Grid>
          
          {}
          <Grid item xs={12}>
            <Card>
              <VuiBox p={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <SearchBar 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CategoryFilter
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                    />
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          </Grid>

          {}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Shop; 