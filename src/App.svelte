<script lang="ts">
  let name: string = "world";

  function toggle() {
    name = name.split("").reverse().join("");
  }
</script>

<p>Hello {name}</p>

<button on:click={toggle}>Toggle</button>
