<script>
    import { onMount } from "svelte";

    let currencyOptions = [];

    onMount(async () => {
        try {
            const responseTableA = await fetch('https://api.nbp.pl/api/exchangerates/tables/a/2016-03-30/?format=json');
            if (!responseTableA.ok) {
                throw new Error('Network response was not ok');
            }
            const tableAData = await responseTableA.json();
            if (tableAData.length > 0) {
                currencyOptions = tableAData[0].rates.map(rate => ({
                    code: rate.code,
                    currency: rate.currency
                }));
            }
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    });
</script>

<main>
    <div>
        <select name="currencySelectFrom">
            {#each currencyOptions as { code, currency }}
                <option value="{code}">{currency}</option>
            {/each}
        </select>
        <input type="number" name="currencySelectFromInput">
    </div>
    <div>
        <select name="currencySelectTo">
        {#each currencyOptions as { code, currency }}
            <option value="{code}">{currency}</option>
        {/each}
        </select>
        <input type="number" name="currencySelectToInput">
    </div>
</main>
