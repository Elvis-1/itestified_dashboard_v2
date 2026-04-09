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
  await expect(page.getByRole("link", { name: /Upload New Scripture/ })).toBeVisible();

  await page.goto("/scripture-of-the-day?menu=1");
  await expect(page.getByRole("link", { name: "View", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit", exact: true })).toBeVisible();

  await page.goto("/scripture-of-the-day?view=2");
  await expect(page.getByRole("heading", { name: "Scripture Details" })).toBeVisible();
  await expect(page.locator("dl").first().getByText("Scheduled Date", { exact: true })).toBeVisible();
  await expect(page.locator("dl").first().getByText("Scheduled", { exact: true })).toBeVisible();

  await page.goto("/scripture-of-the-day?edit=1");
  await expect(page.getByRole("heading", { name: "Edit Scripture" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Changes" })).toBeVisible();
});

test("scripture of the day supports upload new and delete flows", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/scripture-of-the-day?edit=new");
  await expect(page.getByRole("heading", { name: "Schedule Scriptures", level: 1 }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Schedule Settings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "+ Add New" })).toBeVisible();

  await page.goto("/scripture-of-the-day?remove=1");
  await expect(page.getByRole("heading", { name: "Delete Scripture?" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Yes, delete" })).toBeVisible();
});

test("scripture of the day supports filter modal", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/scripture-of-the-day?filter=1");
  const filterModal = page.locator("form[action='/scripture-of-the-day']").filter({ has: page.getByText("Date Range") }).first();
  await expect(filterModal).toBeVisible();
  await expect(filterModal.getByText("Filter", { exact: true })).toBeVisible();
  await expect(filterModal.getByText("Date Range", { exact: true })).toBeVisible();
  await expect(filterModal.getByText("Status", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
});

test("users route supports registered, details, and deactivate flows", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/users");
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await expect(page.getByText("User Management").first()).toBeVisible();
  await expect(page.getByText("Emmanuel Oreoluwa").first()).toBeVisible();

  await page.goto("/users?view=2");
  await expect(page.getByText("User ID").first()).toBeVisible();
  await expect(page.getByText("Registered").first()).toBeVisible();

  await page.goto("/users?deactivate=1");
  await expect(page.getByRole("heading", { name: "Deactivate Account" })).toBeVisible();
  await expect(page.getByText("Confirm Deactivation").first()).toBeVisible();
});

test("users route supports deleted, deactivated, and empty states", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/users?tab=deleted");
  await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
  await expect(page.getByText("Felix Stone").first()).toBeVisible();

  await page.goto("/users?tab=deactivated&view=1");
  await expect(page.getByRole("heading", { name: "Account Timeline" })).toBeVisible();
  await expect(page.getByText("Deactivation Reason").first()).toBeVisible();

  await page.goto("/users?state=empty");
  await expect(page.getByRole("main").getByText("No Data here Yet")).toBeVisible();
});

test("users route supports reactivation flow", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/users?tab=deactivated&reactivate=1");
  await expect(page.getByRole("heading", { name: "Reactivate Account?" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Select/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Reactivate", exact: true })).toBeVisible();

  await page.goto("/users?tab=registered&success=reactivate");
  await expect(page.getByText("Account Reactivated Successfully!").first()).toBeVisible();
});

test("testimonies route supports list, detail, moderation, and filter flows", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/testimonies");
  await expect(page.getByRole("heading", { name: "Testimonies" })).toBeVisible();
  await expect(page.getByText("Testimony").first()).toBeVisible();
  await expect(page.getByText("Emmanuel Oreoluwa").first()).toBeVisible();

  await page.goto("/testimonies?view=1");
  await expect(page.getByText("Miraculous Healing After Prayer").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Approve Testimony" })).toBeVisible();

  await page.goto("/testimonies?view=2");
  await expect(page.getByText("Engagement Analytics").first()).toBeVisible();
  await expect(page.getByText("Approved By").first()).toBeVisible();

  await page.goto("/testimonies?reject=1");
  await expect(page.getByRole("heading", { name: "Reject Testimony" })).toBeVisible();
  await expect(page.getByPlaceholder("Type here...")).toBeVisible();

  await page.goto("/testimonies?success=approve");
  await expect(page.getByText("Testimony Approved Successfully!").first()).toBeVisible();

  await page.goto("/testimonies?filter=1");
  await expect(page.getByText("Status").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
});

test("testimonies route supports video list, details, edit, and upload states", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/testimonies?tab=video");
  await expect(page.getByText("Scheduled").first()).toBeVisible();
  await expect(page.getByText("Drafts").first()).toBeVisible();

  await page.goto("/testimonies?tab=video&screen=upload");
  await expect(page.getByRole("heading", { name: "Upload Video Testimonies" })).toBeVisible();
  await expect(page.getByText("Upload Status").first()).toBeVisible();

  await page.goto("/testimonies?tab=video&settings=1");
  await expect(page.getByRole("heading", { name: "Testimony Settings" })).toBeVisible();

  await page.goto("/testimonies?tab=video&screen=activity");
  await expect(page.getByRole("heading", { name: "Activity Log for Text Testimonies" })).toBeVisible();
  await expect(page.getByText("Export as CSV File").first()).toBeVisible();

  await page.goto("/testimonies?tab=video&view=1");
  await expect(page.getByRole("heading", { name: "Video Details" })).toBeVisible();
  await expect(page.getByText("Upload Date").first()).toBeVisible();

  await page.goto("/testimonies?tab=video&edit=2");
  await expect(page.getByRole("heading", { name: "Edit Video testimony" })).toBeVisible();
  await expect(page.getByText("Scheduled date").first()).toBeVisible();

  await page.goto("/testimonies?tab=video&success=upload");
  await expect(page.getByText("Video Uploaded Successfully!").first()).toBeVisible();
});

test("inspirational pictures route supports list, preview, delete, and upload states", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/inspirational-pictures");
  await expect(page.getByRole("main").getByRole("heading", { name: "Inspirational Pictures", level: 1 })).toBeVisible();
  await expect(page.getByText("Thumbnail").first()).toBeVisible();
  await expect(page.getByText("Status").first()).toBeVisible();

  await page.goto("/inspirational-pictures?menu=3");
  await expect(page.getByText("View").first()).toBeVisible();
  await expect(page.getByText("Edit").first()).toBeVisible();
  await expect(page.getByText("Delete").first()).toBeVisible();

  await page.goto("/inspirational-pictures?view=1");
  await expect(page.getByRole("heading", { name: "Picture Details" })).toBeVisible();
  await expect(page.getByText("Uploaded By").first()).toBeVisible();

  await page.goto("/inspirational-pictures?remove=1");
  await expect(page.getByRole("heading", { name: "Delete This Picture?" })).toBeVisible();

  await page.goto("/inspirational-pictures?screen=upload");
  await expect(page.getByRole("heading", { name: "Upload Picture" })).toBeVisible();
  await expect(page.getByText("Upload Status").first()).toBeVisible();

  await page.goto("/inspirational-pictures?success=upload");
  await expect(page.getByText("Uploaded Successfully!").first()).toBeVisible();
});

test("donations route supports list, filter, and action flows", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/donations");
  await expect(page.getByRole("main").getByRole("heading", { name: "Donations history", level: 1 })).toBeVisible();
  await expect(page.getByText("All Donations").first()).toBeVisible();
  await expect(page.getByText("KY23FN5325").first()).toBeVisible();
  await expect(page.getByPlaceholder("Search by Email, Transaction ID or Amount....")).toBeVisible();
  await expect(page.getByText("Export").first()).toBeVisible();

  await page.goto("/donations?filter=1");
  const donationsFilter = page.locator("form[action='/donations']").first();
  await expect(donationsFilter.getByRole("heading", { name: "Filter" })).toBeVisible();
  await expect(donationsFilter.getByText("Amount", { exact: true })).toBeVisible();
  await expect(donationsFilter.getByText("Currency", { exact: true })).toBeVisible();
  await expect(donationsFilter.getByText("Status", { exact: true })).toBeVisible();
  await expect(donationsFilter.getByText("Date Range", { exact: true })).toBeVisible();
  await expect(donationsFilter.getByRole("button", { name: "Apply" })).toBeVisible();

  await page.goto("/donations?menu=1");
  await expect(page.getByText("Reverse donation").first()).toBeVisible();

  await page.goto("/donations?refund=1");
  await expect(page.getByText("Refund Successful").first()).toBeVisible();

  await page.goto("/donations?reverse=2");
  await expect(page.getByRole("heading", { name: "Reverse Donation" })).toBeVisible();

  await page.goto("/donations?reason=2");
  await expect(page.getByRole("heading", { name: "Reverse Donation" })).toBeVisible();
  await expect(page.getByText("Reason for Reversal").first()).toBeVisible();

  await page.goto("/donations?remove=1");
  await expect(page.getByRole("heading", { name: "Delete Donation?" })).toBeVisible();

  await page.goto("/donations?success=refund");
  await expect(page.getByText("Refund Successful").first()).toBeVisible();
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
