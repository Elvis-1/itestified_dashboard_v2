import { expect, test } from "@playwright/test";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@itestified.app");
  await page.getByLabel("Password").fill("pass123");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL("/overview", { timeout: 15000 });
}

test("splash redirects into admin signup flow", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/signup");
  await expect(page.getByRole("heading", { name: "Welcome!" })).toBeVisible();
  await expect(page.getByLabel("Entry Code")).toBeVisible();
});

test("existing admin can log in and reach overview", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(page.getByText("Pending Testimonies")).toBeVisible();
  await expect(page.getByText("Elvis Igiebor")).toBeVisible();
});

test("overview supports the empty dataset state", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/overview?state=empty");

  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(page.getByText("No Data here Yet")).toBeVisible();
  await expect(page.getByText("Pending Donations")).toBeVisible();
});

test("sidebar logout clears the session and returns to login", async ({ page }) => {
  await loginAsAdmin(page);
  await page.getByRole("button", { name: "Log Out" }).click();

  await expect(page).toHaveURL("/login");
  await page.goto("/overview");
  await expect(page).toHaveURL(/\/login\?redirect=%2Foverview/);
});

test("home page management route renders phase 3 table state", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/home-management");

  await expect(page.getByRole("heading", { name: "Home Page Management" })).toBeVisible();
  await expect(page.getByText("Available Testimonies")).toBeVisible();
  await expect(page.getByText("Display Rule")).toBeVisible();
});

test("home page management supports the remove confirmation state", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/home-management?tab=video&remove=1");

  await expect(page.getByText("Remove from Home Page?")).toBeVisible();
  await expect(page.getByText("Yes, remove")).toBeVisible();
});

test("home page management supports the row action menu state", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/home-management?tab=video&menu=1");

  await expect(page.getByRole("link", { name: "View", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Remove", exact: true })).toBeVisible();
});

test("home page management supports inspirational picture details", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/home-management?tab=pictures&view=1");

  await expect(page.getByText("Picture Details")).toBeVisible();
  await expect(page.getByText("Number of downloads")).toBeVisible();
  await expect(page.getByRole("definition").filter({ hasText: "Instagram.com" })).toBeVisible();
});

test("home page management supports loading, empty, and error states", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/home-management?state=loading");
  await expect(page.getByRole("heading", { name: "Home Page Management" })).toBeVisible();
  await expect(page.getByRole("main").getByText("Available Testimonies").first()).toBeVisible();

  await page.goto("/home-management?state=empty");
  await expect(page.getByRole("heading", { name: "No featured testimonies yet" })).toBeVisible();

  await page.goto("/home-management?state=error");
  await expect(page.getByRole("heading", { name: "Unable to load home page content" })).toBeVisible();
});

test("scripture of the day supports overview, action menu, details, and edit states", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/scripture-of-the-day");
  await expect(page.getByRole("heading", { name: "Scripture of the day" })).toBeVisible();
  await expect(page.getByText("Upload New Scripture")).toBeVisible();

  await page.goto("/scripture-of-the-day?menu=1");
  await expect(page.getByRole("link", { name: "View", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit", exact: true })).toBeVisible();

  await page.goto("/scripture-of-the-day?view=2");
  await expect(page.getByRole("heading", { name: "Scripture Details" })).toBeVisible();
  await expect(page.locator("dl").getByText("Scheduled Date")).toBeVisible();
  await expect(page.locator("dl").getByText("Scheduled", { exact: true })).toBeVisible();

  await page.goto("/scripture-of-the-day?edit=1");
  await expect(page.getByRole("heading", { name: "Edit Scripture" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Changes" })).toBeVisible();
});

test("scripture of the day supports upload new and delete flows", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/scripture-of-the-day?edit=new");
  await expect(page.locator("h1").filter({ hasText: "Schedule Scriptures" })).toBeVisible();
  await expect(page.getByText("Schedule Settings")).toBeVisible();
  await expect(page.getByRole("link", { name: "+ Add New" })).toBeVisible();

  await page.goto("/scripture-of-the-day?remove=1");
  await expect(page.getByText("Delete Scripture?")).toBeVisible();
  await expect(page.getByText("Yes, delete")).toBeVisible();
});

test("scripture of the day supports filter modal", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/scripture-of-the-day?filter=1");
  const filterModal = page.locator("form[action='/scripture-of-the-day']").filter({ has: page.getByText("Date Range") });
  await expect(filterModal).toBeVisible();
  await expect(filterModal.getByText("Filter", { exact: true })).toBeVisible();
  await expect(filterModal.getByText("Date Range", { exact: true })).toBeVisible();
  await expect(filterModal.getByText("Status", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
});

test("entry code flow reaches create-password page", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Email").fill("newadmin@itestified.app");
  await page.getByLabel("Entry Code").fill("ITESTIFIED-ADMIN");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(/\/create-password\?email=newadmin%40itestified\.app/);
  await expect(page.getByRole("heading", { name: "Create New Password" })).toBeVisible();
});

test("entry code plus password creation logs new admin into overview", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Email").fill("freshadmin@itestified.app");
  await page.getByLabel("Entry Code").fill("ITESTIFIED-ADMIN");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(/\/create-password\?email=freshadmin%40itestified\.app/);
  await page.locator('input[aria-label="New Password"]').fill("Admin!234");
  await page.locator('input[aria-label="Confirm New Password"]').fill("Admin!234");
  await page.getByRole("button", { name: "Create Password" }).click();

  await expect(page).toHaveURL("/overview");
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
});
