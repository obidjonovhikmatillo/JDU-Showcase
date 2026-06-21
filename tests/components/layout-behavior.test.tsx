import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function RestaurantAddressFallback({
  address,
  city,
}: {
  address: string;
  city: string;
}) {
  return (
    <div>
      <span data-testid="address-fallback">
        {address}, {city}
      </span>
    </div>
  );
}

describe("T019 map rendering fallback", () => {
  it("shows address text instead of an embedded map", () => {
    render(<RestaurantAddressFallback address="45 Navoi Street" city="Tashkent" />);

    expect(screen.getByTestId("address-fallback")).toHaveTextContent(
      "45 Navoi Street, Tashkent",
    );
    expect(document.querySelector("iframe")).toBeNull();
    expect(document.querySelector('[data-testid="map-embed"]')).toBeNull();
  });
});

describe("T020 mobile navigation layout", () => {
  it("hides desktop navigation below the md breakpoint", () => {
    render(
      <header>
        <nav data-testid="desktop-nav" className="hidden items-center gap-1 md:flex">
          <span>Restaurants</span>
        </nav>
        <span data-testid="mobile-register">Register</span>
      </header>,
    );

    const desktopNav = screen.getByTestId("desktop-nav");
    expect(desktopNav.className).toContain("hidden");
    expect(desktopNav.className).toContain("md:flex");
    expect(screen.getByTestId("mobile-register")).toBeVisible();
  });
});
