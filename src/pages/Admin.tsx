import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Info, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { movies, Movie } from "@/data/movies";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useNavigate } from "react-router-dom";
import * as React from "react";

function isEmailConfirmed(user: any) {
  return !!(user?.email_confirmed_at || user?.confirmed_at);
}

const AdminPage = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: loadingAdminRole, error: adminRoleError } = useAdminRole(user?.id);
  const navigate = useNavigate();

  // Error state for why the admin dashboard is not accessible
  let debugMessage = "";
  let action: React.ReactNode = null;

  React.useEffect(() => {
    // If blocked, set up a delayed redirect (e.g., to login page)
    if (!loading && !loadingAdminRole && (!user || isAdmin === false)) {
      const timer = setTimeout(() => navigate("/auth"), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, isAdmin, loadingAdminRole, navigate]);

  if (loading || loadingAdminRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    debugMessage = "No user is currently authenticated. Please log in.";
    action = (
      <Button onClick={() => navigate("/auth")}>
        <Info className="mr-2 h-4 w-4" /> Go to Login
      </Button>
    );
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-6">
        <div className="p-8 rounded bg-red-100 border border-red-300 shadow">
          <h2 className="text-xl font-bold text-red-900 mb-2">Not Signed In</h2>
          <p className="text-red-800">{debugMessage}</p>
          <p className="mt-2 text-red-800 text-sm">
            The admin dashboard requires authentication.
          </p>
          {action}
        </div>
      </div>
    );
  }

  if (!isEmailConfirmed(user)) {
    debugMessage = "Your email address is not confirmed. Check your inbox for a verification link from Supabase.";
    action = (
      <Button onClick={() => window.location.reload()}>
        <RefreshCcw className="mr-2 h-4 w-4" /> Reload After Verification
      </Button>
    );
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-6 bg-yellow-50">
        <div className="bg-yellow-100 border border-yellow-300 p-8 rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-yellow-800">
            Email Verification Required
          </h2>
          <p className="mb-4 text-yellow-800">{debugMessage}</p>
          <p className="text-yellow-700 text-sm">
            Still not working? Try logging out and logging in again.
          </p>
          {action}
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    debugMessage =
      "You do not have the admin role assigned. This is required for dashboard access.";
    action = (
      <Button
        onClick={() => {
          window.location.href =
            "https://supabase.com/dashboard/project/ngfwenmxbgbytzhqesas/sql/new";
        }}
        variant="outline"
      >
        <Info className="mr-2 h-4 w-4" />
        Open Supabase SQL - Assign Role
      </Button>
    );
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-6">
        <div className="p-8 rounded bg-yellow-100 border border-yellow-300 shadow">
          <h2 className="text-xl font-bold text-yellow-900 mb-2">
            Admin Access Required
          </h2>
          <p className="text-yellow-900">{debugMessage}</p>
          <div className="text-yellow-800 text-sm mt-4">
            <div>
              Steps to fix:
              <ol className="list-decimal ml-6 mt-2 text-yellow-800">
                <li>Log in to Supabase dashboard.</li>
                <li>
                  Run:<br />
                  <span className="bg-white rounded px-2 py-1 text-xs border border-yellow-300 inline-block mb-1">
                    select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
                    <br />
                    insert into public.user_roles (user_id, role) values ('YOUR-USER-ID', 'admin') on conflict do nothing;
                  </span>
                </li>
                <li>Sign out & sign in again.</li>
                <li>
                  <span className="font-medium">If you just signed up, make sure your email address is verified first!</span>
                </li>
              </ol>
            </div>
          </div>
          {action}
        </div>
      </div>
    );
  }

  if (adminRoleError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-6">
        <div className="p-8 rounded bg-red-100 border border-red-300 shadow">
          <h2 className="text-xl font-bold text-red-900 mb-2">
            Error Checking Admin Role
          </h2>
          <p className="text-red-800">{String(adminRoleError)}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // --- Admin panel UI ----------
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="movies">
            <div className="flex items-center pb-4">
              <TabsList>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="shifts">Shifts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Movie
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="movies">
              <Card>
                <CardHeader>
                  <CardTitle>Movies</CardTitle>
                  <CardDescription>
                    Manage your movies and view their sales performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Genre
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Release Date
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movies.map((movie: Movie) => (
                        <TableRow key={movie.id}>
                          <TableCell className="font-medium">
                            {movie.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Now Showing</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {movie.genre.join(", ")}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {movie.releaseDate}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>
                    Manage your staff members. Connect to Supabase to enable this feature.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-8">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <h3 className="text-2xl font-bold tracking-tight">
                        You have no staff members yet
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You can start managing staff once you add them.
                      </p>
                      <Button className="mt-4">Add Staff</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shifts">
              <Card>
                <CardHeader>
                  <CardTitle>Shift Management</CardTitle>
                  <CardDescription>
                    Manage staff shifts. Connect to Supabase to enable this feature.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-8">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <h3 className="text-2xl font-bold tracking-tight">
                        No shifts scheduled
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You can start managing shifts once you add staff.
                      </p>
                      <Button className="mt-4">Create Shift</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    View sales and performance reports. This data will be populated from your database.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-8">
                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                No reports available
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Reports will be generated as you start getting sales.
                            </p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
