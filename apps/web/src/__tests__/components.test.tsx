import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AccordBars, strengthWord } from "@/components/accord-bars";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { NotePyramid } from "@/components/note-pyramid";
import { Pagination } from "@/components/pagination";
import { PerfumeList } from "@/components/perfume-entry";

const perfume = {
  id: "00000000-0000-0000-0000-000000000001", name: "Caffè Notturno", slug: "casa-ficta-caffe-notturno", release_year: 2024,
  brand: { id: "b", name: "Casa Ficta", slug: "casa-ficta", country: "IT", is_synthetic: true, last_verified_at: null },
  family: { id: "f", name: "Gourmand", slug: "gourmand", description: null }, is_synthetic: true, last_verified_at: null,
};

describe("PerfumeList", () => {
  it("renders a linked dictionary entry per perfume", () => {
    render(<PerfumeList perfumes={[perfume]} label="Perfumes" />);
    const list = screen.getByRole("list", { name: "Perfumes" });
    expect(within(list).getByRole("link", { name: "Caffè Notturno" })).toHaveAttribute("href", "/perfumes/casa-ficta-caffe-notturno");
    expect(list).toHaveTextContent("Casa Ficta, 2024");
    expect(list).toHaveTextContent("Gourmand");
  });
});

describe("NotePyramid", () => {
  it("links notes and says when a tier is empty", () => {
    render(<NotePyramid notes={{ top: [{ slug: "bergamot", name: "Bergamot", family: "citrus" }], heart: [], base: [] }} />);
    expect(screen.getByRole("link", { name: "Bergamot" })).toHaveAttribute("href", "/notes/bergamot");
    expect(screen.getAllByText("Not listed")).toHaveLength(2);
  });
});

describe("AccordBars", () => {
  it("describes strength in words and never claims to be a measurement", () => {
    render(<AccordBars accords={[{ slug: "woody", name: "Woody", strength: 100 }, { slug: "citrus", name: "Citrus", strength: 20 }]} />);
    expect(screen.getByRole("link", { name: "Woody" })).toHaveAttribute("href", "/accords/woody");
    expect(screen.getByText("dominant")).toBeInTheDocument();
    expect(screen.getByText("subtle")).toBeInTheDocument();
    expect(screen.getByText(/Not a lab measurement/)).toBeInTheDocument();
  });

  it.each([[100, "dominant"], [80, "dominant"], [79, "prominent"], [55, "prominent"], [30, "noticeable"], [29, "subtle"], [1, "subtle"]])(
    "strength %i is %s", (s, word) => expect(strengthWord(s)).toBe(word),
  );

  it("handles a perfume with no accords", () => {
    render(<AccordBars accords={[]} />);
    expect(screen.getByText("No accords recorded yet.")).toBeInTheDocument();
  });
});

describe("Pagination", () => {
  it("keeps filters on the next-page link and offers a way back", () => {
    render(<Pagination path="/perfumes" params={{ accord: "woody", sort: "name" }} cursor="abc" next="def" />);
    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute("href", "/perfumes?accord=woody&sort=name&cursor=def");
    expect(screen.getByRole("link", { name: "Back to first page" })).toHaveAttribute("href", "/perfumes?accord=woody&sort=name");
  });

  it("renders nothing for a single page", () => {
    const { container } = render(<Pagination path="/perfumes" params={{}} next={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Breadcrumbs", () => {
  it("marks the current page and emits matching structured data", () => {
    const { container } = render(<Breadcrumbs items={[{ name: "Notes", href: "/notes" }, { name: "Iris", href: "/notes/iris" }]} />);
    expect(screen.getByRole("link", { name: "Notes" })).toHaveAttribute("href", "/notes");
    expect(screen.getByText("Iris")).toHaveAttribute("aria-current", "page");
    const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement[1]).toMatchObject({ position: 2, name: "Iris", item: "http://localhost:3000/notes/iris" });
  });
});

describe("JsonLd", () => {
  it("cannot be used to break out of the script tag", () => {
    const { container } = render(<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />);
    const script = container.querySelector("script")!;
    expect(script.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script.textContent!).name).toBe("</script><script>alert(1)</script>");
  });
});
