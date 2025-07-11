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
import { MoreHorizontal, PlusCircle, Info, RefreshCcw, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@/hooks/useStaff";
import { useLeaveRequests, useUpdateLeaveRequest } from "@/hooks/useLeaveRequests";
import { usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion, useTogglePromotionStatus } from "@/hooks/usePromotions";
import { useMoviesDb, useCreateMovie, useUpdateMovie, useDeleteMovie, useToggleMovieStatus } from "@/hooks/useMoviesDb";
import { StaffFormDialog } from "@/components/StaffFormDialog";
import { MovieFormDialog } from "@/components/MovieFormDialog";
import { PromotionFormDialog } from "@/components/PromotionFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

function isEmailConfirmed(user: any) {
  return !!(user?.email_confirmed_at || user?.confirmed_at);
}

const AdminPage = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: loadingAdminRole, error: adminRoleError } = useAdminRole(user?.id);
  const navigate = useNavigate();

  // Data hooks
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: staff, isLoading: staffLoading } = useStaff();
  const { data: leaveRequests, isLoading: leaveRequestsLoading } = useLeaveRequests();
  const { data: promotions, isLoading: promotionsLoading } = usePromotions();
  const { data: movies, isLoading: moviesLoading } = useMoviesDb();

  // Mutation hooks
  const updateBookingStatus = useUpdateBookingStatus();
  const updateLeaveRequest = useUpdateLeaveRequest();
  const togglePromotionStatus = useTogglePromotionStatus();
  const toggleMovieStatus = useToggleMovieStatus();
  
  // Staff mutations
  const deleteStaff = useDeleteStaff();
  
  // Movie mutations
  const deleteMovie = useDeleteMovie();
  
  // Promotion mutations
  const deletePromotion = useDeletePromotion();

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

  // Fix: Only allow admin access when isAdmin === true
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

  // Only render admin UI if isAdmin is true
  if (isAdmin !== true) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="text-green-600">Active</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // --- Admin panel UI ----------
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="bookings">
            <div className="flex items-center pb-4">
              <TabsList>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
            </div>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Management</CardTitle>
                  <CardDescription>
                    Manage customer bookings, approve cancellations and view booking details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="flex justify-center p-4">Loading bookings...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Movie ID</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Show Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings?.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              Movie #{booking.movie_id}
                            </TableCell>
                            <TableCell>{booking.seat_number}</TableCell>
                            <TableCell>
                              {format(new Date(booking.show_time), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(booking.status)}
                            </TableCell>
                            <TableCell className="capitalize">{booking.language}</TableCell>
                            <TableCell>
                              {format(new Date(booking.created_at), 'MMM dd, yyyy')}
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
                                  {booking.status !== 'cancelled' && (
                                    <DropdownMenuItem
                                      onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'cancelled' })}
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancel Booking
                                    </DropdownMenuItem>
                                  )}
                                  {booking.status === 'cancelled' && (
                                    <DropdownMenuItem
                                      onClick={() => updateBookingStatus.mutate({ id: booking.id, status: 'active' })}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Reactivate
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Movies Tab */}
            <TabsContent value="movies">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Movie Management</CardTitle>
                      <CardDescription>
                        Manage movie listings and their status.
                      </CardDescription>
                    </div>
                    <MovieFormDialog />
                  </div>
                </CardHeader>
                <CardContent>
                  {moviesLoading ? (
                    <div className="flex justify-center p-4">Loading movies...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Genre</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movies?.map((movie) => (
                          <TableRow key={movie.id}>
                            <TableCell className="font-medium">
                              {movie.title}
                            </TableCell>
                            <TableCell>{movie.genre.join(", ")}</TableCell>
                            <TableCell>{movie.duration} min</TableCell>
                            <TableCell>{movie.rating}</TableCell>
                            <TableCell>
                              {movie.is_active ? (
                                <Badge variant="outline" className="text-green-600">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell className="capitalize">{movie.language}</TableCell>
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
                                  <MovieFormDialog 
                                    movie={movie} 
                                    isEdit={true}
                                    trigger={
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        Edit Movie
                                      </DropdownMenuItem>
                                    }
                                  />
                                  <DropdownMenuItem
                                    onClick={() => toggleMovieStatus.mutate({ id: movie.id, is_active: !movie.is_active })}
                                  >
                                    {movie.is_active ? 'Deactivate' : 'Activate'}
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                        Delete Movie
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Movie</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{movie.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deleteMovie.mutate(movie.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Staff Tab */}
            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Staff Management</CardTitle>
                      <CardDescription>
                        Manage your staff members and their information.
                      </CardDescription>
                    </div>
                    <StaffFormDialog />
                  </div>
                </CardHeader>
                <CardContent>
                  {staffLoading ? (
                    <div className="flex justify-center p-4">Loading staff...</div>
                  ) : staff && staff.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Department</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead>Hire Date</TableHead>
                           <TableHead>
                             <span className="sr-only">Actions</span>
                           </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                         {staff.map((staffMember) => (
                           <TableRow key={staffMember.id}>
                             <TableCell className="font-medium">
                               {staffMember.name}
                             </TableCell>
                             <TableCell>{staffMember.email}</TableCell>
                             <TableCell>{staffMember.position}</TableCell>
                             <TableCell>{staffMember.department || 'N/A'}</TableCell>
                             <TableCell>
                               {getStatusBadge(staffMember.status)}
                             </TableCell>
                             <TableCell>
                               {format(new Date(staffMember.hire_date), 'MMM dd, yyyy')}
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
                                   <StaffFormDialog 
                                     staff={staffMember} 
                                     isEdit={true}
                                     trigger={
                                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                         Edit Staff
                                       </DropdownMenuItem>
                                     }
                                   />
                                   <AlertDialog>
                                     <AlertDialogTrigger asChild>
                                       <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                         Delete Staff
                                       </DropdownMenuItem>
                                     </AlertDialogTrigger>
                                     <AlertDialogContent>
                                       <AlertDialogHeader>
                                         <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                                         <AlertDialogDescription>
                                           Are you sure you want to delete "{staffMember.name}"? This action cannot be undone.
                                         </AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                                         <AlertDialogAction 
                                           onClick={() => deleteStaff.mutate(staffMember.id)}
                                           className="bg-red-600 hover:bg-red-700"
                                         >
                                           Delete
                                         </AlertDialogAction>
                                       </AlertDialogFooter>
                                     </AlertDialogContent>
                                   </AlertDialog>
                                 </DropdownMenuContent>
                               </DropdownMenu>
                             </TableCell>
                           </TableRow>
                         ))}
                      </TableBody>
                    </Table>
                  ) : (
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leave Requests Tab */}
            <TabsContent value="leave-requests">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Request Management</CardTitle>
                  <CardDescription>
                    Review and manage staff leave requests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leaveRequestsLoading ? (
                    <div className="flex justify-center p-4">Loading leave requests...</div>
                  ) : leaveRequests && leaveRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff Member</TableHead>
                          <TableHead>Leave Type</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaveRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              {request.staff?.name || 'Unknown'}
                              <div className="text-sm text-muted-foreground">
                                {request.staff?.position}
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{request.leave_type}</TableCell>
                            <TableCell>
                              {format(new Date(request.start_date), 'MMM dd')} - {format(new Date(request.end_date), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>{request.days_requested} days</TableCell>
                            <TableCell>
                              {getStatusBadge(request.status)}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.reason || 'No reason provided'}
                            </TableCell>
                            <TableCell>
                              {request.status === 'pending' && (
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
                                    <DropdownMenuItem
                                      onClick={() => updateLeaveRequest.mutate({ id: request.id, status: 'approved' })}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => updateLeaveRequest.mutate({ id: request.id, status: 'rejected' })}
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-8">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                          No leave requests
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Staff leave requests will appear here when submitted.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Promotions Tab */}
            <TabsContent value="promotions">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Promotion Management</CardTitle>
                      <CardDescription>
                        Manage promotional offers and discount codes.
                      </CardDescription>
                    </div>
                    <PromotionFormDialog />
                  </div>
                </CardHeader>
                <CardContent>
                  {promotionsLoading ? (
                    <div className="flex justify-center p-4">Loading promotions...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Discount</TableHead>
                          <TableHead>Valid Period</TableHead>
                          <TableHead>Usage</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {promotions?.map((promotion) => (
                          <TableRow key={promotion.id}>
                            <TableCell className="font-medium">
                              {promotion.title}
                            </TableCell>
                            <TableCell>
                              <code className="bg-muted px-2 py-1 rounded text-xs">
                                {promotion.promo_code || 'No code'}
                              </code>
                            </TableCell>
                            <TableCell>
                              {promotion.discount_percentage ? `${promotion.discount_percentage}%` : 
                               promotion.discount_amount ? `$${promotion.discount_amount}` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {format(new Date(promotion.start_date), 'MMM dd')} - {format(new Date(promotion.end_date), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>
                              {promotion.used_count}/{promotion.usage_limit || '∞'}
                            </TableCell>
                            <TableCell>
                              {promotion.is_active ? (
                                <Badge variant="outline" className="text-green-600">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
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
                                  <PromotionFormDialog 
                                    promotion={promotion} 
                                    isEdit={true}
                                    trigger={
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        Edit Promotion
                                      </DropdownMenuItem>
                                    }
                                  />
                                  <DropdownMenuItem
                                    onClick={() => togglePromotionStatus.mutate({ id: promotion.id, is_active: !promotion.is_active })}
                                  >
                                    {promotion.is_active ? 'Deactivate' : 'Activate'}
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                        Delete Promotion
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{promotion.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deletePromotion.mutate(promotion.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    View analytics and performance reports.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Bookings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{bookings?.length || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Movies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {movies?.filter(m => m.is_active).length || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Staff Members
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{staff?.length || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Promotions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {promotions?.filter(p => p.is_active).length || 0}
                        </div>
                      </CardContent>
                    </Card>
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
