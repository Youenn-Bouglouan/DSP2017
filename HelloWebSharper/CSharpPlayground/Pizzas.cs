using System;

namespace Pizzas
{
    public class PizzaRecipe { }
    public class PizzaOrder { }
    public class ColdPizza { }
    public class HotPizza { }
    public class PizzaDelivery { }

    public static class PizzaService
    {
        public static PizzaOrder OrderPizza(PizzaRecipe recipe, string size)
        {
            return new PizzaOrder();
        }

        public static ColdPizza PreparePizza(PizzaOrder order)
        {
            return new ColdPizza();
        }

        public static HotPizza CookPizza(ColdPizza pizza, int temperature)
        {
            return new HotPizza();
        }

        public static PizzaDelivery DeliverPizza(HotPizza pizza)
        {
            return new PizzaDelivery();
        }

        // The ol'good way.
        public static PizzaDelivery BigPizzaProcess1(PizzaRecipe recipe)
        {
            var order = OrderPizza(recipe, "big");
            var coldPizza = PreparePizza(order);
            var hotPizza = CookPizza(coldPizza, 180);
            var delivery = DeliverPizza(hotPizza);

            return delivery;
        }

        // The Arabic way: You read from right to left.
        public static PizzaDelivery BigPizzaProcess2(PizzaRecipe recipe)
        {
            return DeliverPizza(CookPizza(PreparePizza(OrderPizza(recipe, "big")), 180));
        }

        // The nice way!
        public static PizzaDelivery BigPizzaProcess3(PizzaRecipe recipe)
        {
            return recipe
                    .Order("big")
                    .Prepare()
                    .Cook(180)
                    .Deliver();
        }
    }

    public static class PizzaExtensions
    {
        public static PizzaOrder Order(this PizzaRecipe recipe, string size)
        {
            return PizzaService.OrderPizza(recipe, size);
        }

        public static ColdPizza Prepare(this PizzaOrder order)
        {
            return PizzaService.PreparePizza(order);
        }

        public static HotPizza Cook(this ColdPizza pizza, int temperature)
        {
            return PizzaService.CookPizza(pizza, temperature);
        }

        public static PizzaDelivery Deliver(this HotPizza pizza)
        {
            return PizzaService.DeliverPizza(pizza);
        }
    }
}