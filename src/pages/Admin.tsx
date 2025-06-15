
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { movies, Movie } from "@/data/movies";

const AdminPage = () => {
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
