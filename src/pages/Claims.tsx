import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Ambulance,
  Car,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define Zod schema for form validation
const formSchema = z.object({
  claimId: z.string().min(3, {
    message: "Claim ID must be at least 3 characters.",
  }),
  provider: z.string().min(2, {
    message: "Provider must be at least 2 characters.",
  }),
  claimType: z.enum(["health", "vehicle"]),
  amount: z.number().min(1, {
    message: "Amount must be greater than 0.",
  }),
  dateOfClaim: z.date(),
  status: z.enum(["pending", "approved", "rejected"]),
  notes: z.string().optional(),
});

// Mock data types
type Claim = {
  id: number;
  claimId: string;
  provider: string;
  claimType: "health" | "vehicle";
  amount: number;
  dateOfClaim: Date;
  status: "pending" | "approved" | "rejected";
  notes?: string;
};

// Mock data
const initialClaims: Claim[] = [
  {
    id: 1,
    claimId: "CLM-2023-001",
    provider: "City General Hospital",
    claimType: "health",
    amount: 2500,
    dateOfClaim: new Date("2023-01-15"),
    status: "approved",
    notes: "Routine checkup.",
  },
  {
    id: 2,
    claimId: "VCL-2023-002",
    provider: "AutoFix Services",
    claimType: "vehicle",
    amount: 1200,
    dateOfClaim: new Date("2023-02-20"),
    status: "pending",
    notes: "Minor collision repair.",
  },
  {
    id: 3,
    claimId: "CLM-2023-003",
    provider: "Wellness Clinic",
    claimType: "health",
    amount: 800,
    dateOfClaim: new Date("2023-03-10"),
    status: "rejected",
    notes: "Cosmetic procedure not covered.",
  },
  {
    id: 4,
    claimId: "VCL-2023-004",
    provider: "Speedy Auto Repairs",
    claimType: "vehicle",
    amount: 3500,
    dateOfClaim: new Date("2023-04-05"),
    status: "approved",
    notes: "Engine overhaul.",
  },
  {
    id: 5,
    claimId: "CLM-2023-005",
    provider: "Family Health Center",
    claimType: "health",
    amount: 1200,
    dateOfClaim: new Date("2023-05-12"),
    status: "pending",
    notes: "Annual physical exam.",
  },
  {
    id: 6,
    claimId: "VCL-2023-006",
    provider: "Crash Experts",
    claimType: "vehicle",
    amount: 5000,
    dateOfClaim: new Date("2023-06-18"),
    status: "rejected",
    notes: "Totaled vehicle, policy lapsed.",
  },
  {
    id: 7,
    claimId: "CLM-2023-007",
    provider: "Global Medical Group",
    claimType: "health",
    amount: 1800,
    dateOfClaim: new Date("2023-07-01"),
    status: "approved",
    notes: "Specialist consultation.",
  },
  {
    id: 8,
    claimId: "VCL-2023-008",
    provider: "Top Gear Auto",
    claimType: "vehicle",
    amount: 800,
    dateOfClaim: new Date("2023-08-24"),
    status: "pending",
    notes: "Windshield replacement.",
  },
  {
    id: 9,
    claimId: "CLM-2023-009",
    provider: "Prime Diagnostics",
    claimType: "health",
    amount: 3000,
    dateOfClaim: new Date("2023-09-30"),
    status: "approved",
    notes: "Advanced imaging services.",
  },
  {
    id: 10,
    claimId: "VCL-2023-010",
    provider: "Elite Auto Body",
    claimType: "vehicle",
    amount: 6200,
    dateOfClaim: new Date("2023-10-10"),
    status: "rejected",
    notes: "Extensive body work, pre-existing damage.",
  },
  {
    id: 11,
    claimId: "CLM-2023-011",
    provider: "Holistic Healing Center",
    claimType: "health",
    amount: 950,
    dateOfClaim: new Date("2023-11-03"),
    status: "approved",
    notes: "Alternative therapy session.",
  },
  {
    id: 12,
    claimId: "VCL-2023-012",
    provider: "Reliable Roadside",
    claimType: "vehicle",
    amount: 400,
    dateOfClaim: new Date("2023-12-19"),
    status: "pending",
    notes: "Tire change service.",
  },
  {
    id: 13,
    claimId: "CLM-2024-001",
    provider: "City General Hospital",
    claimType: "health",
    amount: 2800,
    dateOfClaim: new Date("2024-01-22"),
    status: "approved",
    notes: "Follow-up appointment.",
  },
  {
    id: 14,
    claimId: "VCL-2024-002",
    provider: "Precision Auto Works",
    claimType: "vehicle",
    amount: 1500,
    dateOfClaim: new Date("2024-02-28"),
    status: "pending",
    notes: "Brake replacement.",
  },
  {
    id: 15,
    claimId: "CLM-2024-003",
    provider: "Wellness Clinic",
    claimType: "health",
    amount: 700,
    dateOfClaim: new Date("2024-03-05"),
    status: "rejected",
    notes: "Wellness program not covered.",
  },
  {
    id: 16,
    claimId: "VCL-2024-004",
    provider: "Express Auto Care",
    claimType: "vehicle",
    amount: 4000,
    dateOfClaim: new Date("2024-04-11"),
    status: "approved",
    notes: "Transmission repair.",
  },
  {
    id: 17,
    claimId: "CLM-2024-005",
    provider: "Family Health Center",
    claimType: "health",
    amount: 1300,
    dateOfClaim: new Date("2024-05-18"),
    status: "pending",
    notes: "Allergy testing.",
  },
  {
    id: 18,
    claimId: "VCL-2024-006",
    provider: "Collision Masters",
    claimType: "vehicle",
    amount: 5500,
    dateOfClaim: new Date("2024-06-24"),
    status: "rejected",
    notes: "Major accident, driver at fault.",
  },
  {
    id: 19,
    claimId: "CLM-2024-007",
    provider: "Global Medical Group",
    claimType: "health",
    amount: 2000,
    dateOfClaim: new Date("2024-07-07"),
    status: "approved",
    notes: "Advanced diagnostics.",
  },
  {
    id: 20,
    claimId: "VCL-2024-008",
    provider: "Premier Auto Service",
    claimType: "vehicle",
    amount: 900,
    dateOfClaim: new Date("2024-08-30"),
    status: "pending",
    notes: "Routine maintenance.",
  },
];

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Claim | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const claimsPerPage = 10;
  const { toast } = useToast();

  // Form state using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      claimId: "",
      provider: "",
      claimType: "health",
      amount: 0,
      dateOfClaim: new Date(),
      status: "pending",
      notes: "",
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Add new claim to the state
    const newClaim: Claim = {
      id: claims.length + 1,
      ...values,
    };
    setClaims([...claims, newClaim]);

    // Reset the form
    form.reset();

    // Display success toast
    toast({
      title: "Claim added successfully!",
      description: "Your claim has been added to the list.",
    });
  };

  // Function to handle claim update
  const updateClaim = (id: number, updatedClaim: Claim) => {
    const updatedClaims = claims.map((claim) =>
      claim.id === id ? updatedClaim : claim
    );
    setClaims(updatedClaims);
  };

  // Function to handle claim deletion
  const deleteClaim = (id: number) => {
    const updatedClaims = claims.filter((claim) => claim.id !== id);
    setClaims(updatedClaims);
  };

  // Function to handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Function to handle sorting
  const handleSort = (column: keyof Claim) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Filter claims based on search query
  const filteredClaims = claims.filter((claim) => {
    const searchRegex = new RegExp(searchQuery, "i");
    return (
      searchRegex.test(claim.claimId) ||
      searchRegex.test(claim.provider) ||
      searchRegex.test(claim.claimType) ||
      searchRegex.test(claim.amount.toString()) ||
      searchRegex.test(formatDate(claim.dateOfClaim)) ||
      searchRegex.test(claim.status)
    );
  });

  // Sort claims based on sort column and direction
  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    }
    return 0;
  });

  // Paginate claims
  const startIndex = (currentPage - 1) * claimsPerPage;
  const endIndex = startIndex + claimsPerPage;
  const paginatedClaims = sortedClaims.slice(startIndex, endIndex);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const pageCount = Math.ceil(sortedClaims.length / claimsPerPage);
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  // Sort options
  const sortOptions = [
    { label: "Claim ID", value: "claimId" },
    { label: "Provider", value: "provider" },
    { label: "Claim Type", value: "claimType" },
    { label: "Amount", value: "amount" },
    { label: "Date of Claim", value: "dateOfClaim" },
    { label: "Status", value: "status" },
    { label: "Hospital", value: "provider" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Claims</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Claim</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Claim</DialogTitle>
                <DialogDescription>
                  Add a new claim to the list.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="claimId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Claim ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <FormControl>
                          <Input placeholder="Provider" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="claimType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select claim type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="vehicle">Vehicle</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Amount"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfClaim"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Claim</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="center" side="bottom">
                            <DatePicker
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={false}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Date when the claim was made.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="pending" />
                            </FormControl>
                            <FormLabel>Pending</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="approved" />
                            </FormControl>
                            <FormLabel>Approved</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="rejected" />
                            </FormControl>
                            <FormLabel>Rejected</FormLabel>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notes"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Additional notes about the claim.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Add Claim</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claims List</CardTitle>
          <CardDescription>
            All claims submitted by customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {sortOptions.map((option) => (
                    <TableHead
                      key={option.value}
                      className="cursor-pointer"
                      onClick={() => handleSort(option.value as keyof Claim)}
                    >
                      {option.label}
                      {sortColumn === option.value && (
                        <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>{claim.claimId}</TableCell>
                    <TableCell>{claim.provider}</TableCell>
                    <TableCell>
                      {claim.claimType === "health" ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                          <Ambulance className="mr-1 h-3 w-3" /> Health
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-50">
                          <Car className="mr-1 h-3 w-3" /> Vehicle
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{claim.amount}</TableCell>
                    <TableCell>{formatDate(claim.dateOfClaim)}</TableCell>
                    <TableCell>{claim.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>View Claim</DialogTitle>
                              <DialogDescription>
                                View details of the claim.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Claim ID</Label>
                                <Input value={claim.claimId} readOnly />
                              </div>
                              <div>
                                <Label>Provider</Label>
                                <Input value={claim.provider} readOnly />
                              </div>
                              <div>
                                <Label>Claim Type</Label>
                                <Input value={claim.claimType} readOnly />
                              </div>
                              <div>
                                <Label>Amount</Label>
                                <Input value={claim.amount.toString()} readOnly />
                              </div>
                              <div>
                                <Label>Date of Claim</Label>
                                <Input value={formatDate(claim.dateOfClaim)} readOnly />
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Input value={claim.status} readOnly />
                              </div>
                              <div>
                                <Label>Notes</Label>
                                <Textarea value={claim.notes} readOnly />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Delete Claim</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this claim?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2">
                              <Button variant="secondary">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteClaim(claim.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {pageNumbers.map((page) => (
                    <PaginationItem key={page} active={currentPage === page}>
                      <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageCount}
                  />
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Card>
    </div>
  );
};

export default Claims;
