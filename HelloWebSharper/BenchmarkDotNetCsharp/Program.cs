using System;
using System.Collections.Generic;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

namespace BenchmarkDotNetCsharp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var summary = BenchmarkRunner.Run<PerformanceTests>();
            Console.WriteLine(summary);
        }
    }

    [MemoryDiagnoser]
    public class PerformanceTests
    {
        private static string[] _names = 
        {
            "John", "Albert", "Tomasz", "Jean-Pierre", "Nathalie",
            "Samantha", "Edward", "Tanya", "Michelle", "Kurt",
            "Justine", "Christian", "Christopher", "Andres", "Katarzyna",
            "Leon", "Adrian", "Sheldon", "Maxime", "Monika"
        };

        private static bool[] _booleans = { true, false };

        private List<Customer> _customers;

        [Setup]
        public void CSharp_GenerateCustomers()
        {
            var numberToGenerate = 1000000;
            var random = new Random(10);
            var customers = new List<Customer>();
            
            for (int index = 1; index <= numberToGenerate; index++)
            {
                var customer = new Customer()
                {
                    Id = index,
                    Age = random.Next(18, 100),
                    Name = _names[random.Next(0, _names.Length)],
                    IsVip = _booleans[random.Next(0, _booleans.Length)],
                    CustomerSince = DateTime.Today.AddMonths(-random.Next(0, 121))
                };

                customers.Add(customer);
            }

            _customers = customers;

            // Check the number of VIP customers:
            // CSharp_GenerateCustomers VIP customers count: 80 251 / 100 000
            // CSharp_GenerateCustomers VIP customers count: 801 227 / 1 000 000
            
//            var today = DateTime.Today;
//            var vipCustomersCount = _customers.Count(c => (today - c.CustomerSince).TotalDays > 365 * 2);
//            Console.WriteLine($"CSharp_GenerateCustomers VIP customers count: {vipCustomersCount}");
        }

        [Benchmark]
        public void CSharp_ModifyCustomers()
        {
            var today = DateTime.Today;

            foreach (var customer in _customers)
            {
                // If customer for more than 2 years
                if ((today - customer.CustomerSince).TotalDays > 365*2)
                {
                    customer.IsVip = true;
                }
            }
        }
    }

    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public bool IsVip { get; set; }
        public DateTime CustomerSince { get; set; }

        public override string ToString()
        {
            return $"{Id}, {Name}, {Age}, {IsVip}, {CustomerSince}";
        }
    }
}