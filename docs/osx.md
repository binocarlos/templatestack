## Docker OSX updating file descriptors

When running liked mode - inotify can stop working.

```bash
$ cd ~/Library/Containers/com.docker.docker/Data/database/
$ git reset --hard
$ rm com.docker.driver.amd64-linux/slirp/max-connections
$ echo 3000 > com.docker.driver.amd64-linux/slirp/max-connections
$ git add com.docker.driver.amd64-linux/slirp/max-connections
$ git commit -s -m 'Update the maximum number of connections'
```

